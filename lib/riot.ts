/**
 * Riot API Helper
 *
 * Wrapper functions for interacting with the Riot Games API
 */

const RIOT_API_KEY = process.env.RIOT_API_KEY!;

// Region routing map for match history API
const REGION_ROUTING: Record<string, string> = {
  na1: "americas",
  br1: "americas",
  la1: "americas",
  la2: "americas",
  euw1: "europe",
  eun1: "europe",
  tr1: "europe",
  ru: "europe",
  kr: "asia",
  jp1: "asia",
  oc1: "sea",
  ph2: "sea",
  sg2: "sea",
  th2: "sea",
  tw2: "sea",
  vn2: "sea",
};

// Types
export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface RiotSummoner {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface RiotLeagueEntry {
  leagueId: string;
  summonerId: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export interface RiotMatchParticipant {
  puuid: string;
  summonerId: string;
  summonerName: string;
  championId: number;
  championName: string;
  teamPosition: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  totalDamageDealtToChampions: number;
  goldEarned: number;
}

export interface RiotMatch {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: {
    gameId: number;
    gameMode: string;
    gameType: string;
    gameDuration: number;
    gameStartTimestamp: number;
    gameEndTimestamp: number;
    queueId: number;
    participants: RiotMatchParticipant[];
  };
}

// API Functions

/**
 * Get account info by Riot ID (gameName#tagLine)
 */
export async function getAccountByRiotId(
  gameName: string,
  tagLine: string
): Promise<RiotAccount | null> {
  try {
    const response = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName
      )}/${encodeURIComponent(tagLine)}`,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error(`Riot API error: ${response.status}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to get account:", error);
    return null;
  }
}

/**
 * Get account info by PUUID
 */
export async function getAccountByPuuid(
  puuid: string
): Promise<RiotAccount | null> {
  try {
    const response = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Failed to get account by PUUID:", error);
    return null;
  }
}

/**
 * Get summoner info by PUUID
 */
export async function getSummonerByPuuid(
  puuid: string,
  platform: string = "na1"
): Promise<RiotSummoner | null> {
  try {
    const response = await fetch(
      `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Failed to get summoner:", error);
    return null;
  }
}

/**
 * Get ranked stats by summoner ID
 */
export async function getRankedStats(
  summonerId: string,
  platform: string = "na1"
): Promise<RiotLeagueEntry[]> {
  try {
    const response = await fetch(
      `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error("Failed to get ranked stats:", error);
    return [];
  }
}

/**
 * Get match IDs for a player
 */
export async function getMatchIds(
  puuid: string,
  platform: string = "na1",
  count: number = 20,
  queueId?: number
): Promise<string[]> {
  try {
    const region = REGION_ROUTING[platform] || "americas";
    const params = new URLSearchParams({
      count: count.toString(),
    });

    // Filter to ranked solo queue (420) by default
    if (queueId) {
      params.append("queue", queueId.toString());
    }

    const response = await fetch(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?${params}`,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error("Failed to get match IDs:", error);
    return [];
  }
}

/**
 * Get match details
 */
export async function getMatch(
  matchId: string,
  platform: string = "na1"
): Promise<RiotMatch | null> {
  try {
    const region = REGION_ROUTING[platform] || "americas";

    const response = await fetch(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        next: { revalidate: 86400 }, // Cache for 24 hours (matches don't change)
      }
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Failed to get match:", error);
    return null;
  }
}

/**
 * Get current patch version
 */
export async function getCurrentPatch(): Promise<string> {
  try {
    const response = await fetch(
      "https://ddragon.leagueoflegends.com/api/versions.json",
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) return "14.3.1";
    const versions: string[] = await response.json();
    return versions[0] || "14.3.1";
  } catch {
    return "14.3.1";
  }
}

/**
 * Format rank string from league entry
 */
export function formatRank(entry: RiotLeagueEntry): string {
  return `${entry.tier} ${entry.rank}`;
}

/**
 * Calculate win rate from league entry
 */
export function calculateWinRate(entry: RiotLeagueEntry): number {
  const total = entry.wins + entry.losses;
  if (total === 0) return 0;
  return Math.round((entry.wins / total) * 100);
}
