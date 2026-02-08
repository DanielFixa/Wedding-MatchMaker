# Product Requirements Document (PRD) - Wedding Matchmaker

## 1. Project Overview
**Wedding Matchmaker** is a web application designed to help couples collaboratively plan their wedding. It allows partners to create decision-making "rooms," invite their significant other, and use a "Tinder-like" swiping interface to agree on wedding elements such as venues, rings, and decor.

## 2. User Roles
- **Couple (Admin/Host)**: Creates the account, sets up the wedding details, and invites their partner.
- **Partner (Guest)**: Joins the session using a unique room code to participate in the selection process.

## 3. Implemented Features & Functional Requirements

### 3.1 Authentication (Login & Registration)
**Status**: Fully Implemented
- **Goal**: Secure access to the platform using Supabase Authentication.
- **Functionality**:
    - Users can **Register** using email, password, and couple names.
    - Users can **Login** with registered credentials.
    - Authentication state is persistent across sessions.
    - Protected routes (e.g., Dashboard) redirect unauthenticated users to Login.

### 3.2 Dashboard & Room Management
**Status**: Fully Implemented
- **Goal**: Central hub for managing matching sessions.
- **Functionality**:
    - **Create Room**: Users can create a new matching room by selecting a category (e.g., Dresses, Rings, Venues, Decor) and Deck Size.
    - **Join Room**: Users can join an existing room using a 5-character alphanumeric code.
    - **Room Lobby**: Both users wait in a lobby until the session starts.
    - **Realtime Sync**: The lobby updates automatically when a partner joins.

### 3.3 Game Interface (Swiping)
**Status**: Fully Implemented
- **Goal**: Collaborative decision making via swiping.
- **Functionality**:
    - **Image Stack**: Displays a stack of images based on the room's category (fetched via Unsplash API).
    - **Swipe Mechanics**: Users swipe Right (Like) or Left (Nope).
    - **Realtime Voting**: Votes are recorded in Supabase and synchronized in realtime.
    - **Progress Tracking**: Both users see a progress bar indicating how many votes have been cast.
    - **Completion**: When the target number of votes is reached, users are redirected to the Results page.

### 3.4 Results & Gallery
**Status**: Fully Implemented
- **Goal**: Review matches and history.
- **Functionality**:
    - **Results Page**: Displays items that both users "Liked" (Matched).
    - **Gallery (Couples Memory)**: A persistent history of all Liked and Noped items across sessions.

### 3.5 Supplier Search (Find Suppliers)
**Status**: Partially Implemented
- **Goal**: Allow couples to find wedding suppliers.
- **Functionality**:
    - **Search Interface**: A dedicated page to query suppliers.
    - **Filters**: Users can filter results by Category, Location, and Price Range.
    - **Results Display**: Suppliers are displayed as cards with images, ratings, and details.
    - **Shortlist Button**: A "Shortlist" button exists on cards (currently visual/client-side interaction only, does not persist to database).

## 4. Technical Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion.
- **Backend/Database**: Supabase (PostgreSQL, Auth, Realtime).
- **Testing**: TestSprite (Automated E2E/Integration tests).

## 5. Success Metrics
- Successful user registration/login.
- Smooth room creation and partner joining.
- Realtime synchronization of swipes and lobby status.
- Functional supplier search and filtering.
