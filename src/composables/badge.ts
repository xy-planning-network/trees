export enum BadgeKind {
  Neutral = "xy-badge",
  Blue = "xy-badge-blue",
  Green = "xy-badge-green",
  Yellow = "xy-badge-yellow",
  Red = "xy-badge-red",
}

export const isBadgeKind = (kind: string): kind is BadgeKind => {
  return Object.values(BadgeKind).includes(kind as BadgeKind)
}
