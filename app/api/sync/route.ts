import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getMatchIds,
  getMatch,
  getSummonerByPuuid,
  getRankedStats,
  formatRank,
} from "@/lib/riot";
import { normalizeRole, calculateKDA } from "@/lib/utils";

const RANKED_SOLO_QUEUE_ID = 420;

interface ChampionStats {
  championId: number;
  championName: string;
  games: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  lastPlayed: Date;
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.riotPuuid) {
      return NextResponse.json(
        { error: "User not found or not connected to Riot" },
        { status: 404 }
      );
    }

    const puuid = user.riotPuuid;
    const platform = user.region || "na1";

    // Get summoner info for ranked stats
    const summoner = await getSummonerByPuuid(puuid, platform);
    let rank: string | null = null;

    if (summoner) {
      const rankedStats = await getRankedStats(summoner.id, platform);
      const soloQueue = rankedStats.find(
        (entry) => entry.queueType === "RANKED_SOLO_5x5"
      );
      if (soloQueue) {
        rank = formatRank(soloQueue);
      }
    }

    // Get recent ranked match IDs
    const matchIds = await getMatchIds(puuid, platform, 30, RANKED_SOLO_QUEUE_ID);

    if (matchIds.length === 0) {
      return NextResponse.json(
        { error: "No ranked matches found. Play some ranked games first!" },
        { status: 400 }
      );
    }

    // Aggregate champion stats
    const championStats: Map<number, ChampionStats> = new Map();
    let primaryRole: string | null = null;
    const roleCounts: Record<string, number> = {};

    // Process matches (limit to prevent rate limiting)
    const matchesToProcess = matchIds.slice(0, 20);

    for (const matchId of matchesToProcess) {
      const match = await getMatch(matchId, platform);
      if (!match) continue;

      // Find the player in the match
      const participant = match.info.participants.find(
        (p) => p.puuid === puuid
      );
      if (!participant) continue;

      const {
        championId,
        championName,
        teamPosition,
        kills,
        deaths,
        assists,
        win,
      } = participant;

      // Track role
      const role = normalizeRole(teamPosition);
      roleCounts[role] = (roleCounts[role] || 0) + 1;

      // Update champion stats
      const existing = championStats.get(championId);
      if (existing) {
        existing.games++;
        existing.wins += win ? 1 : 0;
        existing.kills += kills;
        existing.deaths += deaths;
        existing.assists += assists;
        if (match.info.gameEndTimestamp > existing.lastPlayed.getTime()) {
          existing.lastPlayed = new Date(match.info.gameEndTimestamp);
        }
      } else {
        championStats.set(championId, {
          championId,
          championName,
          games: 1,
          wins: win ? 1 : 0,
          kills,
          deaths,
          assists,
          lastPlayed: new Date(match.info.gameEndTimestamp),
        });
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Determine primary role
    let maxRoleCount = 0;
    for (const [role, count] of Object.entries(roleCounts)) {
      if (count > maxRoleCount) {
        maxRoleCount = count;
        primaryRole = role;
      }
    }

    // Update user's champion pool in database
    for (const [championId, stats] of championStats) {
      const winRate = stats.games > 0 ? (stats.wins / stats.games) * 100 : 0;
      const avgKDA = calculateKDA(
        stats.kills / stats.games,
        stats.deaths / stats.games,
        stats.assists / stats.games
      );

      await prisma.championPool.upsert({
        where: {
          userId_championId: {
            userId,
            championId,
          },
        },
        update: {
          gamesPlayed: stats.games,
          wins: stats.wins,
          losses: stats.games - stats.wins,
          winRate,
          avgKDA,
          lastPlayed: stats.lastPlayed,
        },
        create: {
          userId,
          championId,
          championName: stats.championName,
          gamesPlayed: stats.games,
          wins: stats.wins,
          losses: stats.games - stats.wins,
          winRate,
          avgKDA,
          lastPlayed: stats.lastPlayed,
        },
      });
    }

    // Update user with rank and role
    await prisma.user.update({
      where: { id: userId },
      data: {
        rank: rank || user.rank,
        role: primaryRole || user.role,
        lastSyncAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Sync complete",
      data: {
        matchesProcessed: matchesToProcess.length,
        championsUpdated: championStats.size,
        rank,
        role: primaryRole,
      },
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Failed to sync matches" }, { status: 500 });
  }
}
