# 🌙 MoonlightSage Moon Tracker

A real-time lunar phase tracker built with React and Vite, featuring archetypal wisdom for each phase of the Moon's journey.

## Features

- **Real-time Moon Phase Tracking** - Displays current lunar phase and illumination percentage
- **8 Lunar Phases** - New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent
- **Archetypal Wisdom** - Each phase includes its archetype and contemplative guidance
- **Elemental Correspondences** - Connects each phase to its elemental quality
- **Geocentric Phenomenological Perspective** - Classical tropical astrology approach
- **MoonlightSage Brand Aesthetic** - Sage, terracotta, slate, cream, moss, dusty blue, rust, and gold color palette

## Tech Stack

- React 19
- Vite 7
- SunCalc (lunar calculations)
- CSS3 with custom properties

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Vercel

**📚 For detailed deployment instructions, see:**
- [Complete Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md) - Comprehensive step-by-step instructions
- [Quick Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Fast reference for deployments
- Or use the included `deploy.sh` script for automated deployment

### Quick Start Deployment

#### Using the Deploy Script (Easiest)
```bash
# Make executable (first time only)
chmod +x deploy.sh

# Run the script
./deploy.sh
```

The script will guide you through:
1. Testing build locally
2. Building production version
3. Deploying to Vercel (preview or production)

### Option 1: Vercel CLI (Recommended)

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the project directory:
```bash
cd moon-tracker
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? (Select your account)
   - Link to existing project? **N**
   - Project name: **moon-tracker** (or your preferred name)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

5. For production deployment:
```bash
vercel --prod
```

### Option 2: Vercel Dashboard (Git Integration)

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "New Project"

4. Import your repository

5. Vercel will auto-detect Vite and configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Click "Deploy"

### Option 3: Manual Upload

1. Build the project locally:
```bash
npm run build
```

2. Go to [vercel.com](https://vercel.com) and click "New Project"

3. Select "Deploy from Vercel CLI" and upload the `dist` folder

## Environment Variables

No environment variables required for basic deployment.

## Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `moon.moonlightsage.co`)
4. Follow DNS configuration instructions

## Vercel Configuration

The project includes `vercel.json` with:
- SPA routing configuration
- Build settings
- Output directory specification

## Moon Phase Calculation

Uses the SunCalc library for accurate lunar calculations based on:
- Current date/time
- Moon illumination fraction
- Phase angle (0-1 scale)

## Brand Colors

```css
--sage: #8B9D83
--terracotta: #C97D5D
--slate: #4A5568
--cream: #F5F1E8
--moss: #5F7355
--dusty-blue: #7C9BAF
--rust: #A0522D
--gold: #D4AF37
```

## Philosophy

This tracker embraces a geocentric phenomenological stance—we track the Moon as we witness her from Earth. The archetypal wisdom draws from classical tropical astrology and Hermetic traditions, honoring the Moon as a conscious luminary whose phases guide us through cycles of manifestation and release.

## License

© 2024 MoonlightSage. For educational and contemplative purposes.

---

*"The Moon teaches us that darkness is not the enemy of light, but its companion in the dance of becoming."*
