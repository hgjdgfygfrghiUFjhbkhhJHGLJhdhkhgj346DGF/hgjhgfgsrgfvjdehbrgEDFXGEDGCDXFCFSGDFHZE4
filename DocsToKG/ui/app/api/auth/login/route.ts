import { NextResponse } from "next/server";
import { ensureSchema, getConnection } from "@/app/lib/db";
import { createToken, setAuthCookie, verifyPassword } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ message: "Missing email, password, or role" }, { status: 400 });
    }

    await ensureSchema();
    const pool = await getConnection();
    const [rows] = await pool.query(
      "SELECT user_id, email, password, first_name, last_name, role, is_blocked FROM User WHERE email = ?",
      [email]
    );

    const user = Array.isArray(rows) ? rows[0] : null;
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Enforce role match
    if (user.role !== role) {
      return NextResponse.json({ message: "Role mismatch for this account" }, { status: 403 });
    }

    // Blocked user check
    if (user.is_blocked) {
      return NextResponse.json({
        message: "You are blocked by the administrator, please contact them to reactivate your account."
      }, { status: 403 });
    }

    // Mark user as connected and record login history
    try {
      await pool.query("UPDATE User SET is_connected = 1 WHERE user_id = ?", [user.user_id]);
      await pool.query("INSERT INTO UsersHistory (user_id, event) VALUES (?, 'login')", [user.user_id]);
    } catch (err) {
      console.error("Failed to update connection state or history", err);
    }

    const token = createToken({ user_id: user.user_id, email: user.email, role: user.role });
    const response = NextResponse.json({
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    });

    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
