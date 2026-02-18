# Clutchly

**Your Daily Ranked Copilot for League of Legends**

> Before you queue, know exactly what to play. 3 picks. 1 ban. Your build. Personalized to YOUR match history.

![Clutchly Screenshot](screenshot.png)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database (local or hosted)
- API keys (see Environment Variables)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/clutchly.git
cd clutchly

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your values

# Generate Prisma client
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
clutchly/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── card/          # Daily card generation
│   │   ├── checkout/      # Stripe checkout
│   │   ├── sync/          # Match history sync
│   │   ├── waitlist/      # Email waitlist
│   │   └── webhook/       # Stripe webhooks
│   ├── home/              # Dashboard page
│   ├── login/             # Login page
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── DailyCard.tsx     # Main card component
├── lib/                   # Utility libraries
│   ├── ai.ts             # Claude AI integration
│   ├── prisma.ts         # Database client
│   ├── riot.ts           # Riot API wrapper
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma
├── public/               # Static assets
├── .env.example          # Environment template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔑 Environment Variables

Create `.env.local` with these values:

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/clutchly"

# Riot Games API
RIOT_API_KEY="RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Anthropic (Claude AI)
ANTHROPIC_API_KEY="sk-ant-api03-xxxxx"

# Stripe
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
STRIPE_PRO_PRICE_ID="price_xxxxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="your-secret-key-min-32-chars"
```

### Getting API Keys

| Service | Where to Get |
|---------|--------------|
| Riot API | [developer.riotgames.com](https://developer.riotgames.com) |
| Anthropic | [console.anthropic.com](https://console.anthropic.com) |
| Stripe | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) |

---

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy the connection string to `DATABASE_URL`
3. Run `pnpm db:push`

### Option 2: Local PostgreSQL

```bash
# Create database
createdb clutchly

# Update DATABASE_URL
DATABASE_URL="postgresql://localhost:5432/clutchly"

# Push schema
pnpm db:push
```

### Database Commands

```bash
pnpm db:generate   # Generate Prisma client
pnpm db:push       # Push schema changes (dev)
pnpm db:migrate    # Create migration (prod)
pnpm db:studio     # Open Prisma Studio GUI
```

---

## 🛠️ Development

### Available Scripts

```bash
pnpm dev           # Start dev server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Run ESLint
```

### Testing Stripe Webhooks

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhook
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma |
| AI | Claude API (Anthropic) |
| Payments | Stripe |
| Game Data | Riot Games API |

---

## 📱 Features

### Free Tier
- ✓ Daily card (1 per day)
- ✓ 7-day card history
- ✓ Basic champion stats

### Pro ($9/month)
- ✓ Unlimited card regenerations
- ✓ 90-day history
- ✓ Deep performance analytics
- ✓ Priority support

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/waitlist` | Add email to waitlist |
| POST | `/api/sync` | Sync match history from Riot |
| GET | `/api/card?userId=x` | Get today's card |
| POST | `/api/card` | Generate new card |
| POST | `/api/checkout` | Create Stripe checkout session |
| POST | `/api/webhook` | Handle Stripe webhooks |

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

Works with any platform that supports Next.js:
- Railway
- Render
- AWS Amplify
- Netlify

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

Proprietary - All rights reserved.

---

## ⚠️ Disclaimer

Clutchly isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.

---

Built with ❤️ for ranked climbers
