import { NextResponse } from "next/server";
import { clearAuthCookie, getUserFromToken } from "@/app/lib/auth";
import { getConnection } from "@/app/lib/db";

export async function POST() {
  const response = NextResponse.json({ success: true });
  try {
    const user = await getUserFromToken();
    if (user?.user_id) {
      const pool = await getConnection();
      await pool.query("UPDATE User SET is_connected = 0 WHERE user_id = ?", [user.user_id]);
      await pool.query("INSERT INTO UsersHistory (user_id, event) VALUES (?, 'logout')", [user.user_id]);
    }
  } catch (err) {
    console.error("Logout tracking failed", err);
  }
  clearAuthCookie(response);
  return response;
}
