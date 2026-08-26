// app/api/auth/signin/route.js

import UserModel from "@/models/User";
import connectToDB from "@/configs/db";
import {
  generateToken,
  verifyPassword,
} from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // اتصال به دیتابیس
    await connectToDB();

    // دریافت اطلاعات
    const body = await req.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // =========================
    // Validation
    // =========================

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "ایمیل و رمز عبور الزامی است.",
        },
        {
          status: 422,
        }
      );
    }

    // بررسی ساده فرمت ایمیل
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

    // =========================
    // پیدا کردن کاربر
    // =========================

    const user = await UserModel.findOne({
      email,
    });

    // بهتر است مشخص نکنیم ایمیل وجود دارد یا رمز اشتباه است
    // تا اطلاعاتی درباره کاربران دیتابیس لو نرود.
    if (!user) {
      return NextResponse.json(
        {
          message: "ایمیل یا رمز عبور اشتباه است.",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // بررسی Password
    // =========================

    const isValidPassword =
      await verifyPassword(
        password,
        user.password
      );

    if (!isValidPassword) {
      return NextResponse.json(
        {
          message: "ایمیل یا رمز عبور اشتباه است.",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // Generate JWT
    // =========================

    const token = generateToken({
      userId: user._id.toString(),
    });

    // =========================
    // Response
    // =========================

    const response = NextResponse.json(
      {
        success: true,
        message: "ورود با موفقیت انجام شد.",
      },
      {
        status: 200,
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

        // در Production حتماً HTTPS
        secure: process.env.NODE_ENV === "production",

        sameSite: "lax",

        path: "/",

        // 24 ساعت
        maxAge: 24 * 60 * 60,
      }
    );

    return response;

  } catch (error) {

    console.error(
      "Sign in error:",
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