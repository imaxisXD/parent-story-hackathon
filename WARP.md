# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Parent Story is a Next.js application that transforms daily parent experiences into magical bedtime stories. Users can record their day, select character themes, and have their real-life adventures converted into engaging children's stories with an activity tracking system.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with Turbopack optimization
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter checks
- `npm run format` - Auto-format code with Biome

### Environment Setup
Ensure `.env.local` contains:
```
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

## Architecture Overview

### Core Technologies
- **Next.js 15.5.0** with React 19 and TypeScript 5
- **App Router** with Turbopack for fast development and builds
- **Convex** as real-time backend for story data persistence and synchronization
- **Shadcn/ui** component library with custom pink theme
- **Tailwind CSS v4** with PostCSS configuration
- **Biome** for modern linting and formatting

### Directory Structure
- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components including Shadcn/ui components
- `/lib` - Utility functions (primarily `utils.ts` with `cn` helper)
- `/convex` - Backend schema and functions for real-time data

## Key Technologies

### Next.js + Turbopack
The project uses Next.js 15.5.0 with Turbopack enabled for both development (`--turbopack` flag) and production builds. This provides significantly faster build times and hot reloading.

### Convex Backend
Convex provides real-time database functionality for story management. The `ConvexClientProvider` wraps the entire application in `app/layout.tsx`, enabling real-time data sync throughout the app.

### Biome Configuration
Replaces ESLint/Prettier with modern tooling. Configuration in `biome.json` includes:
- React and Next.js specific rules
- Auto-organize imports
- 2-space indentation
- Git integration for changed files only

### Shadcn/ui Components
Pre-built accessible components with custom theming. Configuration in `components.json` uses:
- "new-york" style variant
- Custom path aliases for easy imports
- Lucide React for icons

## Configuration Notes

### TypeScript Paths
- `@/*` - Maps to project root directory
- Enables clean imports like `@/components/ui/button`

### Custom Theming
The app uses a custom pink-themed color scheme:
- Primary color: `#ec4899` (pink)
- Custom fonts: Grandstander (serif/headings) and Rubik (sans/body)
- Light/dark mode support with CSS variables
- Custom CSS classes for Notion-style interactions

### Environment Variables
- `NEXT_PUBLIC_CONVEX_URL` - Required for Convex backend connection
- Deployment managed via Convex CLI

### Custom CSS Utilities
- `.notion-hover` - Subtle hover effects mimicking Notion's UI
- `.git-calendar` - Grid layout for activity calendar
- `.git-day` - Individual day squares with activity levels (0-4)

## Project-Specific Notes

### Main Application Features
1. **Voice Recording Interface** - Central recording button with visual feedback, timer, and waveform animation
2. **Character Selection** - Grid of character options (superhero, pirate, astronaut, etc.) that influence story generation
3. **Story Database** - Table view of created stories with metadata (character, duration, plays, ratings)
4. **Activity Calendar** - Git-style contribution graph showing story creation activity over time

### Recording State Management
The main page component (`app/page.tsx`) manages complex recording states:
- `isRecording` - Controls recording UI and animations
- `recordingTime` - Tracks duration with timer display
- `selectedCharacter` - Influences story generation theme
- Visual feedback includes pulsing rings, waveform animation, and color changes

### Real-time Data with Convex
- All story data persists through Convex backend
- `ConvexClientProvider` enables real-time sync across sessions
- Generated API and type definitions in `/convex/_generated/`

### Custom Styling Approach
- Notion-inspired hover effects for interactive elements
- Git contribution calendar with pink color scaling
- Custom pink theme overriding default Shadcn colors
- Smooth transitions and subtle animations throughout

### Development Workflow
- Turbopack provides instant feedback during development
- Biome handles both linting and formatting in a single tool
- TypeScript strict mode enabled for better code quality
- Component-driven development with reusable Shadcn/ui pieces
