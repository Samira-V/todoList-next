import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      {
        status: 200,
      }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;

  } catch (error) {
    console.error("Signout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
      },
      {
        status: 500,
      }
    );
  }
}