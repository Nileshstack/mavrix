# Mavrix Technologies: Landing Page Redesign

A motion-driven, single-page redesign of the [Mavrix Technologies](https://www.mavrixtechnologies.org.in/) website, a digital engineering and intelligent systems studio based in Ghaziabad, India. Built with Next.js and Tailwind CSS, with scroll-driven storytelling, interactive sections and smooth animation throughout.

**Live demo:** TODO add URL
**Original site:** https://www.mavrixtechnologies.org.in/

![Hero preview](./docs/hero.png)
<!-- TODO: add screenshots to /docs and update the path -->

## Highlights

- **Animated hero** with an interactive canvas dot-grid that reacts to the cursor, a scroll-reactive gear, and a live "deploy log" terminal card
- **Scroll-scrubbed manifesto** where words light up as you scroll
- **Interactive services explorer** with a unique animated visual for each of the 7 services
- **Architecture playground**: toggle stack layers (Web, AI, Data, Workflow) and watch the system diagram redraw with animated data pulses
- **Pinned horizontal-scroll** delivery process (5 stages) powered by GSAP ScrollTrigger
- **Tech-stack marquee** that speeds up with scroll velocity
- Preloader, floating pill navbar, custom cursor, smooth scrolling and magnetic buttons
- Validated contact form (Zod) with an API route
- Fully responsive, keyboard accessible, and respects `prefers-reduced-motion`

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS |
| Animation | Motion (`motion/react`), GSAP + ScrollTrigger, Lenis |
| Validation | Zod |
| Icons | lucide-react |
| Fonts | Outfit, Playfair Display, JetBrains Mono (`next/font`) |

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm (or pnpm / yarn)

### Installation

```bash
git clone TODO-your-repo-url
cd TODO-your-repo-name
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SITE_URL=https://www.mavrixtechnologies.org.in
```

This value is used for canonical URLs, the sitemap, `robots.txt`, Open Graph tags and JSON-LD.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |

## Project Structure

```
src/
├── app/
│   ├── api/inquiry/route.ts   # Contact form endpoint
│   ├── layout.tsx             # Fonts, metadata, providers
│   ├── page.tsx               # Landing page composition
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/                # Navbar, footer, preloader, cursor, floating widgets
│   ├── sections/              # Hero, Proof, Manifesto, Services, Delivery, FAQ, Contact...
│   ├── motion/                # Reveal, SplitText, Magnetic, CountUp, Marquee, SmoothScroll
│   └── ui/                    # Button, Chip, SectionLabel, service visuals
├── content/
│   └── site.ts                # All site copy in one typed file
└── lib/
    ├── validation.ts          # Shared Zod schemas
    └── site-url.ts            # Canonical site URL helper
```

All copy lives in `src/content/site.ts`, so text can be edited without touching components.

## Design Notes

- Design direction inspired by agency sites such as [kota.co.uk](https://kota.co.uk/): large typography, numbered sections, marquees and scroll-driven storytelling.
- Brand colours: sky blue `#3DB5FF` and navy `#0A0F1F`.
- Only `transform` and `opacity` are animated to keep motion smooth.
- All content is taken from the original Mavrix website. No clients, testimonials or statistics were invented.

## Accessibility and Performance

- Semantic HTML, visible focus states, ARIA on the menu, accordion, tabs, toggles and form
- Reduced-motion mode disables smooth scroll, pinning, marquees, parallax and the custom cursor
- Custom cursor and heavy effects are disabled on touch devices
- Heavy sections (canvas, GSAP) are lazy-loaded

## Roadmap

- [ ] Connect the contact form to email or a database (the API route currently validates and logs only)
- [ ] Add real case studies / selected work
- [ ] Hook the chatbot widget up to a backend

## Deployment

Deploy on [Vercel](https://vercel.com): import the repo, set `NEXT_PUBLIC_SITE_URL`, and deploy.

## Author

**Nilesh**
GitHub: TODO · LinkedIn: TODO

## Disclaimer

This is a redesign project. Brand name, copy and contact details belong to Mavrix Technologies.
