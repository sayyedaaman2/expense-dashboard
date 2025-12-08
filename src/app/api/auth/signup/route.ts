import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db"; // you *should* be doing this

export async function POST(request: NextRequest) {
  try {
    await connectDB(); 

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid or empty JSON body" },
        { status: 400 }
      );
    }

    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const isExist = await User.findOne({ email });

    if (isExist) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists.",
        },
        { status: 400 }
      );
    }

    const userCreated = await User.create({ name, email, password });
    const {password:removedPassword, ...safeUser} = userCreated.toObject();
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully.",
        safeUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Some internal server error",
      },
      { status: 500 }
    );
  }
}
