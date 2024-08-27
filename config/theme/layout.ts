/**
 * borderRadius
 * experimental .rounded class utilities for consitency with the brand design language
 *
 * These rounded utilities should be used mostly for layout container styles like cards,
 * continue to use tailwind rounded utilities for other components like buttons and inputs.
 */
export const borderRadius = {
  xy: "1.125rem", // rounded-xy 18px - use with padding < 1.5rem/24px
  "xy-lg": "1.5rem", // rounded-xy-lg 32px - use with padding > 1.5rem/24px
}
