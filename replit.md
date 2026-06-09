# Afia – Landing Page

## Overview
Afia is a social media content creator platform. This project is a Next.js 14 landing page showcasing Afia's features, pricing, and FAQ — designed to convert visitors into app downloads.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Framework
- **Next.js 14** – App Router
- **TypeScript** – Full type safety
- **Tailwind CSS v3** – Utility-first styling with custom teal color palette
- **React 18** – UI layer

### Project Structure
```
app/
  layout.tsx        — Root layout with Inter font + metadata
  page.tsx          — Single-page layout, imports all sections
  globals.css       — Tailwind base + custom CSS variables
  sections/
    Navbar.tsx      — Sticky nav with active link state ("use client")
    Hero.tsx        — Eyebrow, headline, App Store / Google Play CTAs
    MediaReel.tsx   — 3 video thumbnails with play buttons + stat badge
    Features.tsx    — AI Video Analyzer card + 4-column feature grid
    Pricing.tsx     — Monthly (light) + Yearly (dark gradient) pricing cards
    FAQ.tsx         — Accordion FAQ, first item pre-expanded
    Footer.tsx      — Dark teal gradient footer with watermark + subscribe

components/ui/
  Button.tsx        — Variants: primary, ghost, outline
  Badge.tsx         — Teal pill badge (variant: teal | white)
  FeatureCard.tsx   — Icon + title + description card
  PricingCard.tsx   — Full pricing card with CTA
  AccordionItem.tsx — "use client" open/close toggle
  SectionHeader.tsx — Centered title + subtitle
  VideoThumb.tsx    — Image with play button overlay + optional stat badge

lib/
  faq-data.ts       — 8 FAQ Q&A pairs
  features-data.ts  — 4 feature card definitions (icon, title, description)
  pricing-data.ts   — Monthly and Yearly plan data
  utils.ts          — cn() helper (clsx + tailwind-merge)

public/
  thumb1.png        — Creator photo for media reel
  thumb2.png        — Beauty creator photo (middle card)
  thumb3.png        — Creator recording video photo
  phone-mockup.png  — iPhone Afia app screenshot for features section
```

### Design System
- **Primary color**: Teal `#0FA37F`
- **Typography**: Inter (next/font/google)
- **Border radius**: rounded-full (buttons), rounded-2xl/rounded-3xl (cards)
- **Sections**: White alternating with gray-50 backgrounds
- **Footer**: Dark teal gradient `from-[#064135] via-[#0c8267] to-[#0FA37F]`

### Dev Server
- **Command**: `npx next dev -p 5000`
- **Port**: 5000
- **Workflow**: "Start application"

### Deployment
- **Build**: `next build`
- **Start**: `next start -p 5000`
- **Platform**: Replit Autoscale

## Sections (in order)
1. **Navbar** – Sticky, white, logo (diamond + Afia), nav links with active state, Contact us button
2. **Hero** – "Stop Guessing." eyebrow, headline, subtext, App Store + Google Play CTAs
3. **Media Reel** – 3 portrait video thumbnails, play overlays, teal "7.2%" badge on middle
4. **Features** – Section header, AI Video Analyzer featured card, 4-column feature grid
5. **Pricing** – "Better content in seconds", Monthly $9.99 + Yearly $49.99 cards
6. **FAQ** – Accordion, 8 questions, first pre-expanded
7. **Footer** – Dark gradient, "Afia" watermark, social icons, address, subscribe form
