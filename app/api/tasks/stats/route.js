import connectToDB from "@/configs/db";
import TodoModel from "@/models/Todo";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectToDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "عدم دسترسی" }, { status: 401 });
    }

    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return Response.json({ message: "توکن نامعتبر است" }, { status: 401 });
    }

    // محاسبه آمار بر اساس userId و فیلد isCompleted
    const totalTasks = await TodoModel.countDocuments({ userId: tokenPayload.userId });
    const completedTasks = await TodoModel.countDocuments({ 
      userId: tokenPayload.userId, 
      isCompleted: true 
    });

    return Response.json({
      success: true,
      total: totalTasks,
      completed: completedTasks,
      pending: totalTasks - completedTasks,
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    return Response.json({ message: "خطای سرور" }, { status: 500 });
  }
}
