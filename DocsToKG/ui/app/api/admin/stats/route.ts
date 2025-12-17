import { NextResponse } from "next/server";
import { ensureSchema, getConnection } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import type { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  try {
    const me = await getUserFromToken();
    if (!me || me.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const range = (url.searchParams.get("range") || "day").toLowerCase();
    const allowed = ["day", "week", "month", "year"] as const;
    const bucketType = allowed.includes(range as any) ? (range as typeof allowed[number]) : "day";

    await ensureSchema();
    const pool = await getConnection();

    // Online / offline counts
    type OnlineRow = RowDataPacket & { online: number; offline: number };
    const [onlineRows] = await pool.query<OnlineRow[]>(
      "SELECT SUM(is_connected = 1) AS online, SUM(is_connected = 0) AS offline FROM User"
    );
    const online = onlineRows[0]?.online || 0;
    const offline = onlineRows[0]?.offline || 0;

    // Projects per user
    type ProjectsRow = RowDataPacket & { user_id: number; name: string; projects: number };
    const [projectsRows] = await pool.query<ProjectsRow[]>(
      `SELECT u.user_id, COALESCE(NULLIF(CONCAT(TRIM(COALESCE(u.first_name,'')), ' ', TRIM(COALESCE(u.last_name,''))), ' '), u.email) AS name,
              COUNT(p.project_name) AS projects
       FROM User u
       LEFT JOIN Project p ON p.user_id = u.user_id
       GROUP BY u.user_id, name
       ORDER BY projects DESC, name ASC`
    );

    // Connections over time (login events)
    let historyQuery = "";
    switch (bucketType) {
      case "week":
        historyQuery = `SELECT YEARWEEK(event_time, 1) AS bucket, COUNT(*) AS count
                        FROM UsersHistory
                        WHERE event = 'login'
                        GROUP BY YEARWEEK(event_time, 1)
                        ORDER BY bucket DESC
                        LIMIT 26`;
        break;
      case "month":
        historyQuery = `SELECT DATE_FORMAT(event_time, '%Y-%m-01') AS bucket, COUNT(*) AS count
                        FROM UsersHistory
                        WHERE event = 'login'
                        GROUP BY DATE_FORMAT(event_time, '%Y-%m-01')
                        ORDER BY bucket DESC
                        LIMIT 12`;
        break;
      case "year":
        historyQuery = `SELECT YEAR(event_time) AS bucket, COUNT(*) AS count
                        FROM UsersHistory
                        WHERE event = 'login'
                        GROUP BY YEAR(event_time)
                        ORDER BY bucket DESC
                        LIMIT 5`;
        break;
      case "day":
      default:
        historyQuery = `SELECT DATE(event_time) AS bucket, COUNT(*) AS count
                        FROM UsersHistory
                        WHERE event = 'login'
                        GROUP BY DATE(event_time)
                        ORDER BY bucket DESC
                        LIMIT 30`;
        break;
    }

    type HistoryRow = RowDataPacket & { bucket: string; count: number };
        const [historyRows] = await pool.query<HistoryRow[]>(historyQuery);

        // Logout buckets
        const logoutQuery = historyQuery.replace("event = 'login'", "event = 'logout'");
        const [logoutRows] = await pool.query<HistoryRow[]>(logoutQuery);

        // Approximate average session duration (minutes) by pairing login->logout per user
        type SessionRow = RowDataPacket & { user_id: number; event: string; event_time: string };
        const [sessionRows] = await pool.query<SessionRow[]>(
          "SELECT user_id, event, event_time FROM UsersHistory WHERE event IN ('login','logout') ORDER BY user_id, event_time"
        );
        let totalMinutes = 0;
        let sessionCount = 0;
        const lastLoginByUser = new Map<number, Date>();
        for (const row of sessionRows) {
          const ts = new Date(row.event_time);
          if (row.event === "login") {
            lastLoginByUser.set(row.user_id, ts);
          } else if (row.event === "logout") {
            const start = lastLoginByUser.get(row.user_id);
            if (start) {
              const mins = (ts.getTime() - start.getTime()) / 60000;
              if (mins >= 0 && Number.isFinite(mins)) {
                totalMinutes += mins;
                sessionCount += 1;
              }
              lastLoginByUser.delete(row.user_id);
            }
          }
        }
        const avgSessionMinutes = sessionCount > 0 ? totalMinutes / sessionCount : 0;

        return NextResponse.json({
          online,
          offline,
          projectsPerUser: projectsRows,
          connectionsLogins: historyRows,
          connectionsLogouts: logoutRows,
          avgSessionMinutes,
          range: bucketType,
        });
  } catch (err) {
    console.error("Admin stats error", err);
    return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
  }
}
