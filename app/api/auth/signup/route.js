import UserModel from "@/models/User";
import connectToDB from "@/configs/db";
import {
  generateToken,
  hashPassword,
} from "@/utils/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {

  try {

    await connectToDB();

    const body = await req.json();

    const {
      name,
      email,
      password,
    } = body;


    // ==============================
    // Validation
    // ==============================

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password?.trim()
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "Data is not valid",
        },
        {
          status: 422,
        }
      );

    }


    // ==============================
    // Check Existing User
    // ==============================

    const normalizedEmail =
      email.trim().toLowerCase();

    const isUserExist =
      await UserModel.findOne({
        email: normalizedEmail,
      });


    if (isUserExist) {

      return NextResponse.json(
        {
          success: false,
          message: "This email already exists",
        },
        {
          status: 409,
        }
      );

    }


    // ==============================
    // Hash Password
    // ==============================

    const hashedPassword =
      await hashPassword(password);


    // ==============================
    // Create User
    // ==============================

    const user =
      await UserModel.create({

        name: name.trim(),

        email: normalizedEmail,

        password: hashedPassword,

      });


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
          message: "User created successfully",
        },
        {
          status: 201,
        }
      );


    // ==============================
    // Cookie
    // ==============================

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
      "Signup error:",
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