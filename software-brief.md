# Bot Skill Manager - Software Brief

## 1. Project Summary

**Product Name:** Bot Skill Manager

**What it is:** A centralized dashboard to track, manage, and document skills across multiple OpenClaw bots/agents. Shows which bot has which skills, what API access each skill requires, and provides quick reference for bot capabilities.

**Main Business Value:** Prevents skill duplication, tracks API credentials, provides visibility into bot capabilities, makes it easy to manage multiple agents.

---

## 2. Recommended Product Shape

**App Type:** Single-page dashboard application

**MVP Focus:**
- Bot/agent registry
- Skill inventory per bot
- API credential tracking
- Quick search/filter
- Simple CRUD operations

**Strategic Positioning:** "Mission Control for OpenClaw Bots" — central command center for managing your AI agent fleet.

---

## 3. Core Features

### Must-Have (MVP)
- **Bot Management:** Add, edit, delete bots/agents
- **Skill Registry:** Track which skills are installed on which bots
- **API Access Tracking:** Document what APIs each skill uses
- **Search & Filter:** Find bots by skill, API, or capability
- **Dashboard Overview:** Visual summary of all bots and their skills
- **Skill Details:** View skill documentation, commands, requirements
- **Bot Comparison:** Compare skills across multiple bots

### Secondary Features (Post-MVP)
- Skill usage analytics
- API credential expiration alerts
- Skill installation wizard
- Bot template creation
- Export/import bot configurations
- Team collaboration (share bot configs)

### Future Features
- Auto-discovery of bot skills
- Skill marketplace integration
- API usage monitoring
- Cost tracking per bot
- Performance metrics

---

## 4. User Roles

**End User Roles:**
- **Bot Manager:** Full access to add/edit bots and skills
- **Viewer:** Read-only access to view bot configurations

**Admin Roles:**
- **Admin:** Manage users, system settings
- **Owner:** Full control including data export/deletion

---

## 5. Screen / Page Map

**Dashboard:**
- Overview stats (total bots, total skills, API count)
- Recent activity feed
- Quick actions (add bot, add skill)

**Bot List:**
- Grid/table of all bots
- Filter by skill, API, status
- Search by name

**Bot Detail:**
- Bot info (name, description, created date)
- Installed skills list
- API credentials summary
- Edit/delete actions

**Skill Library:**
- All skills across all bots
- Skill details (name, version, APIs used)
- Which bots have this skill

**API Registry:**
- All APIs used by skills
- Credential status
- Usage notes

**Add/Edit Bot:**
- Form to create/edit bot
- Add/remove skills
- Document API access

---

## 6. User Flow

**First-Time Setup:**
1. Sign up / Log in
2. Add first bot
3. Document its skills
4. Add API credentials

**Daily Use:**
1. View dashboard overview
2. Search for specific skill
3. Check which bots have it
4. View API requirements
5. Update as needed

**Adding New Bot:**
1. Click "Add Bot"
2. Enter bot name/description
3. Select skills from library (or add new)
4. Document API access for each skill
5. Save

---

## 7. Recommended Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components

**Backend:**
- Next.js API Routes
- Prisma ORM
- SQLite or PostgreSQL (lightweight)
- NextAuth.js for auth

**Deployment:**
- Vercel (free tier sufficient)

**Reasoning:**
- Simple CRUD app doesn't need complex backend
- SQLite works fine for this scale
- Quick to build and deploy
- Easy to maintain

---

## 8. Data Model

**Bot:**
- id, name, description, createdAt, updatedAt
- status (active, inactive, archived)

**Skill:**
- id, name, description, version
- installPath (where skill is located)
- documentationUrl
- commands (JSON array of available commands)

**BotSkill (junction):**
- botId, skillId, installedAt, notes

**ApiCredential:**
- id, name, service (e.g., "OpenAI", "Meta", "Vercel")
- keyIdentifier (masked key reference)
- expirationDate, status
- notes

**SkillApi (junction):**
- skillId, apiCredentialId, required (boolean)

---

## 9. MVP Build Plan

**Phase 1:**
- Project setup
- Database schema
- Auth system
- Basic dashboard layout

**Phase 2:**
- Bot CRUD
- Skill CRUD
- Bot-Skill relationships

**Phase 3:**
- API credential tracking
- Search/filter
- Dashboard widgets

**Phase 4:**
- Polish UI
- Add documentation
- Deploy

---

## 10. Claude Master Build Prompt

Build a Bot Skill Manager dashboard using Next.js 14+ with the following:

**CORE REQUIREMENTS:**

1. **Authentication:**
   - NextAuth.js with email/password
   - Protected routes

2. **Dashboard:**
   - Stats cards (total bots, skills, APIs)
   - Recent bots list
   - Quick action buttons

3. **Bot Management:**
   - List all bots in a table/grid
   - Add new bot (name, description)
   - Edit bot details
   - Delete bot
   - View bot detail page

4. **Skill Management:**
   - List all skills
   - Add new skill (name, description, commands, install path)
   - Edit skill
   - Delete skill
   - View skill detail (which bots have it)

5. **Bot-Skill Association:**
   - On bot detail: add/remove skills
   - On skill detail: see which bots have it
   - Many-to-many relationship

6. **API Credential Tracking:**
   - List all API credentials
   - Add new credential (service name, key identifier, expiration)
   - Link credentials to skills
   - Status indicators (active, expired, etc.)

7. **Search & Filter:**
   - Search bots by name
   - Filter bots by skill
   - Filter skills by API

8. **UI/UX:**
   - Clean, modern dashboard design
   - shadcn/ui components
   - Responsive layout
   - Navigation sidebar

9. **Database:**
   - Prisma schema
   - SQLite for simplicity
   - Migrations setup

10. **Tech Stack:**
    - Next.js 14 App Router
    - TypeScript
    - Tailwind CSS
    - shadcn/ui
    - Prisma + SQLite
    - NextAuth.js

**DEPLOYMENT:**
- Vercel-ready
- Environment variables documented

Build this as a clean, functional MVP. Focus on the core use case: tracking which bots have which skills and API access.
