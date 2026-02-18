import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source } = waitlistSchema.parse(body);

    // Check if email already exists
    const existing = await prisma.waitlistEmail.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 200 }
      );
    }

    // Create new waitlist entry
    await prisma.waitlistEmail.create({
      data: {
        email,
        source: source || "landing_page",
      },
    });

    return NextResponse.json(
      { message: "Successfully joined waitlist" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    );
  }
}
