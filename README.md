# Wedding Matchmaker 💍

A real-time, tinder-style wedding planning application for couples. Built with Next.js 15, Supabase, and Unsplash.

![Project Preview](/public/preview.png)

## Features

-   **Real-time Synced Gameplay**: Couples swipe on wedding items (Venues, Dresses, Rings) in real-time.
-   **Smart Intelligence**: Remembers what you've voted on to ensure fresh decks every game.
-   **Couple's Memory Gallery**: View your mutual matches and "limbo" items in a beautiful masonry grid.
-   **Rescue Mode**: Accidentally swiped left? Recover items from Limbo to vote on them again.
-   **Premium Aesthetic**: "Pearlescent White & Gold" design system with fluid animations.

## Tech Stack

-   **Framework**: Next.js 15 (App Router, Server Actions)
-   **Database**: Supabase (PostgreSQL, Realtime)
-   **Styling**: Tailwind CSS, Framer Motion
-   **API**: Unsplash API (Image Search)

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/wedding-matchmaker.git
    cd wedding-matchmaker
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file with the following keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open in browser**:
    Visit [http://localhost:3000](http://localhost:3000).

## Database Schema (Supabase)

The project uses two main tables:
-   `rooms`: Manages game session state (waiting, active, finished).
-   `votes`: Stores user swipes (like/nope) and enforces unique constraints to prevent duplicate voting.

## License

MIT
