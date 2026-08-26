import connectToDB from "@/configs/db";
import TodoModel from "@/models/Todo";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


// =====================================================
// Get Authenticated User
// =====================================================

async function getAuthenticatedUserId() {

  const cookieStore = await cookies();

  const token =
    cookieStore.get("token")?.value;


  if (!token) {
    return null;
  }


  const decoded =
    verifyToken(token);


  if (!decoded) {
    return null;
  }


  return decoded.userId || null;
}


// =====================================================
// POST - Create Task
// =====================================================

export async function POST(req) {

  try {

    await connectToDB();


    // -------------------------------
    // Authentication
    // -------------------------------

    const userId =
      await getAuthenticatedUserId();


    if (!userId) {

      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }


    // -------------------------------
    // Get Body
    // -------------------------------

    const body =
      await req.json();


    const {
      name,
      description,
      category,
      date,
      time,
      isCompleted,
    } = body;


    // -------------------------------
    // Validation
    // -------------------------------

    if (
      !name?.trim() ||
      !date ||
      !time
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: name, date, or time",
        },
        {
          status: 400,
        }
      );

    }


    // -------------------------------
    // Create Task
    // -------------------------------

    const newTask =
      await TodoModel.create({

        name: name.trim(),

        description:
          description || "",

        category:
          category || "",

        date,

        time,

        isCompleted:
          isCompleted ?? false,

        userId,

      });


    // -------------------------------
    // Response
    // -------------------------------

    return NextResponse.json(
      {
        success: true,
        data: newTask,
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "POST Task Error:",
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


// =====================================================
// GET - Get Tasks
// =====================================================

export async function GET(req) {

  try {

    await connectToDB();


    // -------------------------------
    // Authentication
    // -------------------------------

    const userId =
      await getAuthenticatedUserId();


    if (!userId) {

      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }


    // -------------------------------
    // Query Parameters
    // -------------------------------

    const { searchParams } =
      new URL(req.url);


    const categoryId =
      searchParams.get("category");


    const date =
      searchParams.get("date");


    // -------------------------------
    // Base Query
    // -------------------------------

    const query = {
      userId,
    };


    // -------------------------------
    // Category Filter
    // -------------------------------

    if (categoryId) {
      query.category = categoryId;
    }


    // -------------------------------
    // Date Filter
    // -------------------------------

    if (date) {
      query.date = date;
    }


    // -------------------------------
    // Get Tasks
    // -------------------------------

    const todos =
      await TodoModel
        .find(query)
        .sort({
          date: -1,
          time: 1,
        });


    // -------------------------------
    // Response
    // -------------------------------

    return NextResponse.json({
      success: true,
      data: todos,
    });

  } catch (error) {

    console.error(
      "GET Tasks Error:",
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