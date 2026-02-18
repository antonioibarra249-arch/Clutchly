import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]!;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Detect role from team position
 */
export function normalizeRole(teamPosition: string): string {
  const roleMap: Record<string, string> = {
    TOP: "Top",
    JUNGLE: "Jungle",
    MIDDLE: "Mid",
    BOTTOM: "ADC",
    UTILITY: "Support",
  };
  return roleMap[teamPosition] || teamPosition;
}

/**
 * Get champion icon URL from Data Dragon
 */
export function getChampionIconUrl(
  championName: string,
  patch: string = "14.3.1"
): string {
  // Handle special champion names
  const normalizedName = championName
    .replace(/['\s]/g, "")
    .replace("Wukong", "MonkeyKing");

  return `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${normalizedName}.png`;
}

/**
 * Get item icon URL from Data Dragon
 */
export function getItemIconUrl(
  itemId: number,
  patch: string = "14.3.1"
): string {
  return `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${itemId}.png`;
}

/**
 * Calculate KDA from kills, deaths, assists
 */
export function calculateKDA(
  kills: number,
  deaths: number,
  assists: number
): number {
  if (deaths === 0) return kills + assists;
  return (kills + assists) / deaths;
}

/**
 * Format KDA for display
 */
export function formatKDA(kda: number): string {
  return kda.toFixed(2);
}

/**
 * Get tier color class
 */
export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    IRON: "text-gray-400",
    BRONZE: "text-amber-700",
    SILVER: "text-gray-300",
    GOLD: "text-yellow-500",
    PLATINUM: "text-cyan-400",
    EMERALD: "text-emerald-400",
    DIAMOND: "text-blue-400",
    MASTER: "text-purple-400",
    GRANDMASTER: "text-red-400",
    CHALLENGER: "text-amber-400",
  };
  return colors[tier.toUpperCase()] || "text-gray-400";
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}
