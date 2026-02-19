import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getAccountByRiotId } from "@/lib/riot";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { gameName, tagLine } = await request.json();

    if (!gameName || !tagLine) {
      return NextResponse.json(
        { error: "Riot ID is required (Name#TAG)" },
        { status: 400 }
      );
    }

    const riotAccount = await getAccountByRiotId(gameName, tagLine);

    if (!riotAccount) {
      return NextResponse.json(
        { error: `Could not find Riot account: ${gameName}#${tagLine}. Check the spelling and try again.` },
        { status: 404 }
      );
    }

    const existingLink = await prisma.user.findUnique({
      where: { riotPuuid: riotAccount.puuid },
    });

    if (existingLink && existingLink.id !== authUser.id) {
      return NextResponse.json(
        { error: "This Riot account is already linked to another Clutchly account." },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { id: authUser.id },
      data: {
        riotPuuid: riotAccount.puuid,
        riotName: riotAccount.gameName,
        riotTag: riotAccount.tagLine,
      },
    });

    console.log("[RIOT] Linked " + riotAccount.gameName + "#" + riotAccount.tagLine + " to user " + authUser.id);

    return NextResponse.json({
      message: "Riot account linked successfully",
      riotName: riotAccount.gameName,
      riotTag: riotAccount.tagLine,
    });
  } catch (error) {
    console.error("[RIOT] Link error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
