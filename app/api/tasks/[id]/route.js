import connectToDB from '@/configs/db';
import TodoModel from '@/models/Todo';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import {
  isValidCategory,
} from '@/utils/category';


// ============================================
// Authentication
// ============================================

async function getAuthenticatedUserId() {

  const cookieStore =
    await cookies();

  const token =
    cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {

    const decoded =
      verifyToken(token);

    return decoded?.userId || null;

  } catch {

    return null;

  }
}


// ============================================
// Validate ID
// ============================================

function isValidId(id) {

  return mongoose.Types.ObjectId.isValid(id);

}


// ============================================
// GET
// ============================================

export async function GET(
  req,
  { params }
) {

  try {

    const { id } =
      await params;


    if (!isValidId(id)) {

      return NextResponse.json(
        {
          success: false,
          error: 'شناسه نامعتبر است',
        },
        {
          status: 400,
        }
      );

    }


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


    const task =
      await TodoModel
        .findOne({
          _id: id,
          userId,
        })
        .lean();


    if (!task) {

      return NextResponse.json(
        {
          success: false,
          error: 'Task not found',
        },
        {
          status: 404,
        }
      );

    }


    return NextResponse.json({
      success: true,
      data: task,
    });


  } catch (error) {

    console.error(
      'GET task error:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Server Error',
      },
      {
        status: 500,
      }
    );

  }
}


// ============================================
// PUT
// ============================================

export async function PUT(
  req,
  { params }
) {

  try {

    const { id } =
      await params;


    if (!isValidId(id)) {

      return NextResponse.json(
        {
          success: false,
          error: 'شناسه نامعتبر است',
        },
        {
          status: 400,
        }
      );

    }


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


    // ========================================
    // فقط فیلدهای مجاز
    // ========================================

    const updateData = {};


    if (
      body.name !== undefined
    ) {

      if (
        typeof body.name !== 'string' ||
        !body.name.trim()
      ) {

        return NextResponse.json(
          {
            success: false,
            error: 'نام کار نامعتبر است',
          },
          {
            status: 400,
          }
        );

      }

      updateData.name =
        body.name.trim();

    }


    if (
      body.description !== undefined
    ) {

      updateData.description =
        typeof body.description === 'string'
          ? body.description.trim()
          : '';

    }


    if (
      body.category !== undefined
    ) {

      if (
        !isValidCategory(
          body.category
        )
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

      updateData.category =
        body.category;

    }


    if (
      body.date !== undefined
    ) {

      updateData.date =
        body.date;

    }


    if (
      body.time !== undefined
    ) {

      updateData.time =
        body.time;

    }


    if (
      body.isCompleted !== undefined
    ) {

      if (
        typeof body.isCompleted !==
        'boolean'
      ) {

        return NextResponse.json(
          {
            success: false,
            error: 'وضعیت Task نامعتبر است',
          },
          {
            status: 400,
          }
        );

      }

      updateData.isCompleted =
        body.isCompleted;

    }


    // هیچ چیزی برای Update نیست
    if (
      Object.keys(updateData).length === 0
    ) {

      return NextResponse.json(
        {
          success: false,
          error: 'اطلاعاتی برای ویرایش ارسال نشده است',
        },
        {
          status: 400,
        }
      );

    }


    // ========================================
    // مهم‌ترین قسمت امنیتی
    //
    // _id + userId
    // ========================================

    const updatedTodo =
      await TodoModel.findOneAndUpdate(

        {
          _id: id,
          userId,
        },

        {
          $set: updateData,
        },

        {
          new: true,
          runValidators: true,
        }

      );


    if (!updatedTodo) {

      return NextResponse.json(
        {
          success: false,
          error: 'Task پیدا نشد',
        },
        {
          status: 404,
        }
      );

    }


    return NextResponse.json({
      success: true,
      data: updatedTodo,
    });


  } catch (error) {

    console.error(
      'PUT task error:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Server Error',
      },
      {
        status: 500,
      }
    );

  }
}


// ============================================
// DELETE
// ============================================

export async function DELETE(
  req,
  { params }
) {

  try {

    const { id } =
      await params;


    if (!isValidId(id)) {

      return NextResponse.json(
        {
          success: false,
          error: 'شناسه نامعتبر است',
        },
        {
          status: 400,
        }
      );

    }


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


    const deletedTodo =
      await TodoModel.findOneAndDelete({

        _id: id,

        userId,

      });


    if (!deletedTodo) {

      return NextResponse.json(
        {
          success: false,
          error: 'Task پیدا نشد',
        },
        {
          status: 404,
        }
      );

    }


    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });


  } catch (error) {

    console.error(
      'DELETE task error:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Server Error',
      },
      {
        status: 500,
      }
    );

  }
}