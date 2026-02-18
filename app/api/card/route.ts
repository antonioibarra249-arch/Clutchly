import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateDailyCard, generateFallbackCard } from "@/lib/ai";
import { getTodayDate } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const today = getTodayDate();

    // Check for cached card from today
    const existingCard = await prisma.dailyCard.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(today),
        },
      },
    });

    if (existingCard) {
      return NextResponse.json({ data: existingCard });
    }

    // Get user with champion pool
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        championPool: {
          orderBy: { gamesPlayed: "desc" },
          take: 15,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.championPool.length === 0) {
      return NextResponse.json(
        { error: "No champion data found. Play some ranked games first!" },
        { status: 400 }
      );
    }

    // Format champion pool for AI
    const championData = user.championPool.map((c) => ({
      name: c.championName,
      games: c.gamesPlayed,
      wins: c.wins,
      winRate: c.winRate || 0,
      avgKDA: c.avgKDA || undefined,
    }));

    let cardData;

    try {
      // Generate card with AI
      cardData = await generateDailyCard(
        championData,
        user.rank || "Gold",
        user.role || "ADC",
        user.region || "NA"
      );
    } catch (aiError) {
      console.error("AI generation failed, using fallback:", aiError);
      cardData = generateFallbackCard(championData);
    }

    // Save the card
    const savedCard = await prisma.dailyCard.create({
      data: {
        userId,
        date: new Date(today),
        picks: cardData.picks,
        avoid: cardData.avoid,
        ban: cardData.ban,
        build: cardData.build,
        patchVersion: "14.3", // TODO: Fetch current patch
      },
    });

    return NextResponse.json({ data: savedCard });
  } catch (error) {
    console.error("Card generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate card" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const today = getTodayDate();

    const card = await prisma.dailyCard.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(today),
        },
      },
    });

    if (!card) {
      return NextResponse.json(
        { error: "No card found for today" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: card });
  } catch (error) {
    console.error("Get card error:", error);
    return NextResponse.json(
      { error: "Failed to get card" },
      { status: 500 }
    );
  }
}
