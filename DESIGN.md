# Project Design Guidelines: AnimeVault (Gaming Portal)

## 1. Core Vision & Competitor Analysis
*   **Competitor:** steamunlocked.org
*   **Flaws to Exploit:** Steamunlocked is slow, visually cluttered, feels sketchy (too many ads/fake buttons), and lacks modern filtering.
*   **Our Solution:** A blazing fast, Vercel-inspired sleek UI, built with Astro and Tailwind CSS 4. No clutter. Instant search. Premium "Creation Pirates" aesthetic blending One Piece and Naruto subtle elements.

## 2. Design System & Theme
**Vibe:** Dark, mysterious, high-end tech mixed with Shonen aesthetics.

### Color Palette (Tailwind 4 Ready)
*   **Background (The Void):** `#0A0A0F` (Deep sleek Vercel dark mode)
*   **Surface/Cards (Hidden Mist):** `#14141F` with subtle glassmorphism (`backdrop-blur-md`).
*   **Border Highlights:** `rgba(255, 255, 255, 0.08)`
*   **Text Colors:**
    *   Primary: `#EDEDED` (Clean White)
    *   Secondary: `#A1A1AA` (Muted Zinc)
*   **Accent 1 - The Shinobi (Naruto):** `#F97316` (Kyuubi Orange) - Used for primary Call-to-Actions (Download/Play buttons).
*   **Accent 2 - The Pirate King (One Piece):** `#EF4444` (Conqueror's Haki Red) - Used for hovers, alerts, or "Hot/Trending" badges.
*   **Accent 3 - Chakra/Ocean:** `#06B6D4` (Cyan) - Subtle glows and active navigation states.

### Typography
*   **Headings:** `JetBrains Mono` or `Cal Sans` (Bold, structural, tech-heavy).
*   **Body:** `Inter` (Standard Vercel-like readability, sans-serif).

## 3. UI Components & Layout

### A. Navigation (The Grand Line)
*   Sticky, ultra-thin top navbar with a blur backdrop.
*   Logo on the left (Text: `AnimeVault` with a subtle Sharingan or Strawhat SVG icon).
*   Global instant search bar in the center (Command-K style like modern dev docs).

### B. Hero Section (The Valley of the End)
*   Large headline with a text gradient (Orange to Red).
    *   *Example:* "Unlock the Ultimate Arsenal."
*   Sub-headline: "Ad-free, blazing-fast game library. Choose your bounty."
*   Background: A very dark, subtle, low-opacity mesh gradient blending deep ocean blue and chakra orange.

### C. Game Cards (The Bounties)
*   Instead of standard messy grids, use sleek Vercel-style cards.
*   **Image:** 16:9 game banner (grayscale by default, turns full color on hover).
*   **Card Hover Effect:** A very subtle 3D tilt (Vanilla Tilt) with an Orange or Red glow emitting from the borders.
*   **Badges:** Small tags using Tailwind pills (e.g., `[RPG]`, `[Action]`, `[Size: 40GB]`).

## 4. Technical Constraints (For the AI / Developer)
*   **Framework:** Astro (Use `.astro` components for speed).
*   **Styling:** Strictly Tailwind CSS v4. No external bulky CSS files.
*   **Animations:** Use GSAP or Framer Motion for scroll reveals. Elements should float in smoothly from the bottom (`y: 40`, `opacity: 0` to `1`).
*   **Performance:** Optimize all game banner images. The site must load instantly to destroy the competitor's slow experience.

## 5. Anime "Easter Eggs" for the Theme
*   **404 Page:** "You're lost like Zoro."
*   **Loading States:** A spinning Shuriken or a bouncing Strawhat.
*   **Category Names:** 
    *   Action -> *Shinobi Wars*
    *   Adventure -> *Grand Fleet*
    *   Trending -> *Highest Bounties*