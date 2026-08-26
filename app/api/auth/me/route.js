import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // ==============================
    // Connect Database
    // ==============================

    await connectToDB();


    // ==============================
    // Get Cookie
    // ==============================

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;


    // ==============================
    // Check Token
    // ==============================

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }


    // ==============================
    // Verify Token
    // ==============================

    const decoded = verifyToken(token);


    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        {
          status: 401,
        }
      );
    }


    // ==============================
    // Check userId
    // ==============================

    if (!decoded.userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token payload",
        },
        {
          status: 401,
        }
      );
    }


    // ==============================
    // Find User
    // ==============================

    const user = await UserModel
      .findById(decoded.userId)
      .select("name email");


    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }


    // ==============================
    // Response
    // ==============================

    return NextResponse.json({
      success: true,

      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.error(
      "ME API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}