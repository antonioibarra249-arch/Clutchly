import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("[AUTH] Sign up error:", error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Create user in our database
    if (data.user) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: data.user.id,
            email,
          },
        });
        console.log(`[AUTH] Created user ${email}`);
      }
    }

    return NextResponse.json({
      message: "Account created successfully",
      user: data.user,
    });
  } catch (error) {
    console.error("[AUTH] Sign up error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
