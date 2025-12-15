import { NextResponse } from "next/server";
import { ensureSchema, getConnection } from "@/app/lib/db";
import { createToken, setAuthCookie, verifyPassword } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    await ensureSchema();
    const pool = await getConnection();
    const [rows] = await pool.query(
      "SELECT user_id, email, password, first_name, last_name FROM User WHERE email = ?",
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

    const token = createToken({ user_id: user.user_id, email: user.email });
    const response = NextResponse.json({
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });

    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
