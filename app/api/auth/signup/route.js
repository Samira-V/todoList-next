// app/api/auth/signup/route.js

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
    // =========================
    // Connect DB
    // =========================

    await connectToDB();

    // =========================
    // Get body
    // =========================

    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // =========================
    // Validation
    // =========================

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "نام، ایمیل و رمز عبور الزامی است.",
        },
        {
          status: 422,
        }
      );
    }

    // محدودیت طول نام
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        {
          message: "نام باید بین ۲ تا ۵۰ کاراکتر باشد.",
        },
        {
          status: 422,
        }
      );
    }

    // بررسی ایمیل
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: "فرمت ایمیل صحیح نیست.",
        },
        {
          status: 422,
        }
      );
    }

    // حداقل طول Password
    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
        },
        {
          status: 422,
        }
      );
    }

    // =========================
    // Check existing user
    // =========================

    const existingUser =
      await UserModel.findOne({
        email,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "این ایمیل قبلاً ثبت شده است.",
        },
        {
          status: 409,
        }
      );
    }

    // =========================
    // Hash password
    // =========================

    const hashedPassword =
      await hashPassword(password);

    // =========================
    // Create user
    // =========================

    const newUser =
      await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });

    // =========================
    // Generate token
    // =========================

    const token = generateToken({
      userId: newUser._id.toString(),
    });

    // =========================
    // Response
    // =========================

    const response = NextResponse.json(
      {
        success: true,
        message: "ثبت‌نام با موفقیت انجام شد.",
      },
      {
        status: 201,
      }
    );

    // =========================
    // Secure Cookie
    // =========================

    response.cookies.set(
      "token",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV === "production",

        sameSite: "lax",

        path: "/",

        // 24 ساعت
        maxAge: 24 * 60 * 60,
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
        message: "خطای داخلی سرور.",
      },
      {
        status: 500,
      }
    );
  }
}