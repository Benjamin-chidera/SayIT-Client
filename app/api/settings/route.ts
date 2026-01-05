import { NextResponse } from "next/server";
import { Pool } from "pg";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  try {
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const query = `
      SELECT "id", "name", "email", "language", "gender"
      FROM "user"
      WHERE "id" = $1
    `;

    const values = [userId];
    const res = await db.query(query, values);

    if (!res.rows[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { language, gender } = await request.json();
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    const query = `
            UPDATE "user"
            SET "language" = $1, "gender" = $2
            WHERE "id" = $3
        `;

    const values = [language, gender, userId];

    await db.query(query, values);
    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
