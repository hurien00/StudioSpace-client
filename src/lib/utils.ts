export { cn } from "cn"

// "Photo Studio" -> "photo-studio"
export const toSlug = (text: string) => 
  text.toLowerCase().trim().replace(/\s+/g, "-");

// "photo-studio" -> "Photo Studio"
export const fromSlug = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
