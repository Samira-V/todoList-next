import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import TodoModel from "@/models/Todo";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

const categoriesInfo = [
    {
        id: "work",
        title: "کاری",
        color: "#f97316",
    },
    {
        id: "meet",
        title: "قرار ملاقات",
        color: "#3b82f6",
    },
    {
        id: "personal",
        title: "شخصی",
        color: "#ec4899",
    },
    {
        id: "home",
        title: "خانه",
        color: "#10b981",
    },
];

export async function GET() {
    try {
        await connectToDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return Response.json(
                { message: "You are not logged in!" },
                { status: 401 }
            );
        }

        const tokenPayload = verifyToken(token);

        if (!tokenPayload) {
            return Response.json(
                { message: "You are not logged in!" },
                { status: 401 }
            );
        }

        const user = await UserModel.findById(tokenPayload.userId);

        if (!user) {
            return Response.json(
                { message: "User not found!" },
                { status: 404 }
            );
        }

        // تعداد Todoها بر اساس category
        const categoryCounts = await TodoModel.aggregate([
            {
                $match: {
                    userId: user._id,
                },
            },
            {
                $group: {
                    _id: "$category",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        // تبدیل نتیجه دیتابیس به ساختار مناسب برای فرانت‌اند
        const categories = categoriesInfo.map((category) => {
            const categoryData = categoryCounts.find(
                (item) => item._id === category.id
            );

            const count = categoryData ? categoryData.count : 0;

            return {
                ...category,
                count,
                countText: `${count} tasks`,
            };
        });

        return Response.json(
            {
                data: categories,
            },
            { status: 200 }
        );
    } catch (err) {
        console.log("Categories API Error ->", err);

        return Response.json(
            { message: "Oops! Internal server error" },
            { status: 500 }
        );
    }
}
