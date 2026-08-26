import connectToDB from '@/configs/db';
import TodoModel from '@/models/Todo';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  isValidCategory,
} from '@/utils/category';


// ============================================
// Authentication
// ============================================

async function getAuthenticatedUserId() {

  const cookieStore = await cookies();

  const token =
    cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {

    const decoded =
      verifyToken(token);

    if (!decoded?.userId) {
      return null;
    }

    return decoded.userId;

  } catch (error) {

    console.error(
      'Token verification error:',
      error
    );

    return null;
  }
}


// ============================================
// POST
// Create Task
// ============================================

export async function POST(req) {

  try {

    await connectToDB();

    const userId =
      await getAuthenticatedUserId();

    if (!userId) {

      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }


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


    // ========================================
    // Validation
    // ========================================

    if (
      typeof name !== 'string' ||
      !name.trim()
    ) {

      return NextResponse.json(
        {
          success: false,
          error: 'نام کار الزامی است',
        },
        {
          status: 400,
        }
      );

    }


    if (
      !date ||
      typeof date !== 'string'
    ) {

      return NextResponse.json(
        {
          success: false,
          error: 'تاریخ الزامی است',
        },
        {
          status: 400,
        }
      );

    }


    if (
      !time ||
      typeof time !== 'string'
    ) {

      return NextResponse.json(
        {
          success: false,
          error: 'زمان الزامی است',
        },
        {
          status: 400,
        }
      );

    }


    if (
      !isValidCategory(category)
    ) {

      return NextResponse.json(
        {
          success: false,
          error: 'دسته‌بندی نامعتبر است',
        },
        {
          status: 400,
        }
      );

    }


    // ========================================
    // Create
    // ========================================

    const newTask =
      await TodoModel.create({

        name: name.trim(),

        description:
          typeof description === 'string'
            ? description.trim()
            : '',

        category,

        date,

        time,

        isCompleted:
          Boolean(isCompleted),

        userId,

      });


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
      'POST /api/tasks:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: 'خطای داخلی سرور',
      },
      {
        status: 500,
      }
    );

  }
}


// ============================================
// GET
// Get User Tasks
// ============================================

export async function GET(req) {

  try {

    await connectToDB();

    const userId =
      await getAuthenticatedUserId();

    if (!userId) {

      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      );

    }


    const { searchParams } =
      new URL(req.url);


    const category =
      searchParams.get('category');

    const date =
      searchParams.get('date');


    // ========================================
    // IMPORTANT
    // همیشه userId وجود دارد
    // ========================================

    const query = {
      userId,
    };


    if (category) {

      if (!isValidCategory(category)) {

        return NextResponse.json(
          {
            success: false,
            error: 'دسته‌بندی نامعتبر است',
          },
          {
            status: 400,
          }
        );

      }

      query.category = category;
    }


    if (date) {
      query.date = date;
    }


    const todos =
      await TodoModel
        .find(query)
        .sort({
          date: 1,
          time: 1,
        })
        .lean();


    return NextResponse.json({
      success: true,
      data: todos,
    });


  } catch (error) {

    console.error(
      'GET /api/tasks:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: 'خطای داخلی سرور',
      },
      {
        status: 500,
      }
    );

  }
}