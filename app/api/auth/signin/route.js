import UserModel from "@/models/User";
import connectToDB from "@/configs/db";
import {
  generateToken,
  verifyPassword,
} from "@/utils/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {

  try {

    await connectToDB();

    const body = await req.json();

    const {
      email,
      password,
    } = body;


    // ==============================
    // Validation
    // ==============================

    if (
      !email?.trim() ||
      !password?.trim()
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        {
          status: 422,
        }
      );

    }


    const normalizedEmail =
      email.trim().toLowerCase();


    // ==============================
    // Find User
    // ==============================

    const user =
      await UserModel.findOne({
        email: normalizedEmail,
      });


    if (!user) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Email or password is incorrect",
        },
        {
          status: 401,
        }
      );

    }


    // ==============================
    // Verify Password
    // ==============================

    const isValidPassword =
      await verifyPassword(
        password,
        user.password
      );


    if (!isValidPassword) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Email or password is incorrect",
        },
        {
          status: 401,
        }
      );

    }


    // ==============================
    // Generate Token
    // ==============================

    const token =
      generateToken({
        userId: user._id.toString(),
      });


    // ==============================
    // Response
    // ==============================

    const response =
      NextResponse.json(
        {
          success: true,
          message:
            "User logged in successfully",
        },
        {
          status: 200,
        }
      );


    response.cookies.set(
      "token",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV === "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          24 * 60 * 60,
      }
    );


    return response;

  } catch (error) {

    console.error(
      "Signin error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal server error",
      },
      {
        status: 500,
      }
    );

  }
}