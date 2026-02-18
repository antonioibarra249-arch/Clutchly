/**
 * AI Card Generation
 *
 * Uses Claude to generate personalized daily recommendations
 */

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Types
export interface ChampionData {
  name: string;
  games: number;
  wins: number;
  winRate: number;
  avgKDA?: number;
}

export interface Pick {
  champion: string;
  confidence: number;
  reason: string;
}

export interface DailyCardData {
  picks: Pick[];
  avoid: {
    champion: string;
    reason: string;
  };
  ban: {
    champion: string;
    reason: string;
  };
  build: {
    for: string;
    items: string[];
    boots: string;
    keystone: string;
  };
}

const CARD_GENERATION_PROMPT = `You are a League of Legends ranked coach. Generate tonight's personalized recommendations.

PLAYER INFO:
- Rank: {rank}
- Role: {role}
- Region: {region}

CHAMPION POOL (from their recent ranked games):
{poolText}

Based on:
1. Their personal performance (prioritize high win rate champions they're comfortable on)
2. Current meta considerations
3. Which champions in their pool are strong right now

Generate recommendations in this EXACT JSON format (no markdown, no explanation, just JSON):
{
  "picks": [
    {"champion": "ChampionName", "confidence": 85, "reason": "Brief reason why this is their best pick tonight"},
    {"champion": "ChampionName", "confidence": 75, "reason": "Brief reason"},
    {"champion": "ChampionName", "confidence": 70, "reason": "Brief reason"}
  ],
  "avoid": {
    "champion": "ChampionName",
    "reason": "Why they should avoid this champion from their pool tonight"
  },
  "ban": {
    "champion": "ChampionName",
    "reason": "Why this ban helps them specifically"
  },
  "build": {
    "for": "TopPickChampionName",
    "items": ["Item1", "Item2", "Item3", "Item4", "Item5", "Item6"],
    "boots": "BootsName",
    "keystone": "KeystoneName"
  }
}

IMPORTANT:
- Picks MUST come from their champion pool
- Confidence scores should reflect their personal stats, not just meta strength
- Reasons should be personalized (reference their win rate, games played)
- Avoid champion should be from their pool (one they play but shouldn't tonight)
- Ban should counter their champion pool specifically
- Build should be for their top recommended pick`;

/**
 * Format champion pool for the prompt
 */
function formatChampionPool(pool: ChampionData[]): string {
  return pool
    .map(
      (c) =>
        `- ${c.name}: ${c.games} games, ${c.wins} wins, ${c.winRate.toFixed(1)}% WR${
          c.avgKDA ? `, ${c.avgKDA.toFixed(2)} KDA` : ""
        }`
    )
    .join("\n");
}

/**
 * Parse AI response into structured data
 */
function parseAIResponse(text: string): DailyCardData {
  // Remove any markdown code blocks
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();

  try {
    const data = JSON.parse(cleaned);

    // Validate structure
    if (!data.picks || !Array.isArray(data.picks) || data.picks.length < 1) {
      throw new Error("Invalid picks array");
    }
    if (!data.avoid || !data.avoid.champion) {
      throw new Error("Invalid avoid object");
    }
    if (!data.ban || !data.ban.champion) {
      throw new Error("Invalid ban object");
    }
    if (!data.build || !data.build.items) {
      throw new Error("Invalid build object");
    }

    return data as DailyCardData;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    console.error("Raw response:", text);
    throw new Error("Failed to parse AI response as valid JSON");
  }
}

/**
 * Generate a daily card using Claude AI
 */
export async function generateDailyCard(
  championPool: ChampionData[],
  rank: string = "Gold",
  role: string = "ADC",
  region: string = "NA"
): Promise<DailyCardData> {
  if (championPool.length === 0) {
    throw new Error("No champion data available");
  }

  // Sort by games played and take top 10
  const topChampions = [...championPool]
    .sort((a, b) => b.games - a.games)
    .slice(0, 10);

  const poolText = formatChampionPool(topChampions);

  const prompt = CARD_GENERATION_PROMPT.replace("{rank}", rank)
    .replace("{role}", role)
    .replace("{region}", region)
    .replace("{poolText}", poolText);

  console.log("Generating card with prompt:", prompt.substring(0, 500) + "...");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content?.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }

  return parseAIResponse(content.text);
}

/**
 * Generate a fallback card when AI fails
 */
export function generateFallbackCard(
  championPool: ChampionData[]
): DailyCardData {
  // Sort by win rate (with minimum games threshold)
  const validChampions = championPool.filter((c) => c.games >= 3);
  const sorted = [...validChampions].sort((a, b) => b.winRate - a.winRate);

  const topPicks = sorted.slice(0, 3);
  const worstPick = sorted[sorted.length - 1];

  return {
    picks: topPicks.map((c, i) => ({
      champion: c.name,
      confidence: Math.round(85 - i * 7),
      reason: `${c.winRate.toFixed(0)}% win rate over ${c.games} games`,
    })),
    avoid: {
      champion: worstPick?.name || "None",
      reason: worstPick
        ? `Only ${worstPick.winRate.toFixed(0)}% win rate`
        : "No data",
    },
    ban: {
      champion: "Nautilus",
      reason: "Strong against most ADCs",
    },
    build: {
      for: topPicks[0]?.name || "Unknown",
      items: [
        "Kraken Slayer",
        "Phantom Dancer",
        "Infinity Edge",
        "Lord Dominik's Regards",
        "Bloodthirster",
        "Guardian Angel",
      ],
      boots: "Berserker's Greaves",
      keystone: "Lethal Tempo",
    },
  };
}
