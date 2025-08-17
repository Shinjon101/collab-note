# 📝 CollabNote

**CollabNote** is a modern collaborative note-taking app built with Next.js, Clerk for authentication, Liveblocks for real-time collaboration, and a rich block-based editor powered by BlockNote. Users can write, edit, and share notes in real time—with autosave and live cursors.

 **AI summarization live now!**

---

## Features

-  Auth via [Clerk](https://clerk.dev) (Google and email)
-  Rich text editor with [BlockNote](https://blocknotejs.org/)
-  **Real-time collaboration** with [Liveblocks](https://liveblocks.io/)
-  **AI-Powered Summarization** (select text → get a concise summary)
-  Light/dark theme support via `next-themes`
-   Ready for deployment on [Vercel](https://vercel.com)

---

##  Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **Auth:** Clerk
- **Editor:** BlockNote + Yjs
- **Collaboration:** Liveblocks
- **Database:** PostgreSQL (via [Neon](https://neon.tech/)) + Drizzle ORM
- **ORM:** Drizzle
- **Realtime syncing:** Y.js + Liveblocks
- **AI Integration:** [Cohere Command Model](https://cohere.com/)
- **Hosting:** Vercel

---

## Folder Structure

```
src/
│
├── app/                  # Next.js App Router structure
│   ├── api/auth-endpoint/route.ts  # Backend auth route (Clerk)
│   ├── documents/        # Page routes for documents
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Entry page
│
├── components/           # Reusable UI components
├── db/                   # Drizzle schema, migrations
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── middleware.ts         # Auth middleware

```

---

## Getting Started (Development)

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/collab-note.git
   cd collab-note
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file:

   ```env
   DATABASE_URL=your_postgres_db_url
   CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY=...
   LIVEBLOCKS_SECRET_KEY=...
   COHERE_API_KEY=...
   ```

4. **Run locally:**

   ```bash
   npm run dev
   ```

5. **Build for production:**

   ```bash
   npm run build
   ```

---

## AI Features 

** AI Summarization of notes**
select any text and generate a summary in seconds

---

##  Tips Before Deploying

- ✅ Make sure you're using the production Liveblocks project key
- ✅ Clear test data from your DB (via Neon console or Drizzle migrations)
- ✅ Add `.ico` logo in `public/favicon.ico` for custom tab branding
- ✅ Update site name and description in `src/app/layout.tsx`

---

##  Deployment

Use [Vercel](https://vercel.com) to deploy:

1. Push your code to GitHub
2. Import the project on Vercel
3. Set up all environment variables in the Vercel dashboard
4. **Use a custom domain as Clerk does not allow domain given by vercel**
5. Done! 🎉

---

##  Author

Built with ❤️ by Shinjon — open to feedback and contributions.

---
