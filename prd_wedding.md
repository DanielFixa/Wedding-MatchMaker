# Product Requirements Document (PRD) - Wedding Matchmaker

## 1. Project Overview
**Wedding Matchmaker** is a web application designed to help couples collaboratively plan their wedding. It allows partners to create decision-making "rooms," invite their significant other, and use a "Tinder-like" swiping interface to agree on wedding elements such as venues, rings, and decor.

## 2. User Roles
- **Couple (Admin/Host)**: Creates the account, sets up the wedding details, and invites their partner.
- **Partner (Guest)**: Joins the session using a unique room code to participate in the selection process.
- **Supplier (Future)**: Vendors who list their services (Venues, Photographers, etc.).

## 3. Core Features & Functional Requirements

### 3.1 Authentication (Login & Registration)
**Status**: Implemented
- **Goal**: Secure access to the platform using Supabase Authentication.
- **Requirements**:
    - Users must be able to **Register** using their email, password, and couple names.
    - Users must be able to **Login** with their registered credentials.
    - Authentication state must be persistent across sessions.
    - Unauthenticated users must be redirected to the Login page when accessing protected routes (e.g., Dashboard).

### 3.2 Dashboard & Room Management
**Status**: Implemented
- **Goal**: Central hub for managing matching sessions.
- **Requirements**:
    - **Create Room**: Users can create a new matching room by selecting a category (e.g., Dresses, Rings, Venues, Decor).
    - **Join Room**: Users can join an existing room using a 5-character alphanumeric code.
    - **Room Lobby**: Both users wait in a lobby until the session starts.

### 3.3 Supplier Search (Busca de Fornecedores)
**Status**: Critical Requirement (To Be Implemented/Tested)
- **Goal**: Allow couples to find and filter wedding suppliers.
- **Requirements**:
    - **Search Interface**: A dedicated search bar/page to query suppliers by name or category.
    - **Filters**: Users should be able to filter results by:
        - Category (Venue, Catering, Photography, etc.)
        - Location
        - Price Range
    - **Results Display**: Suppliers should be displayed as cards with images, ratings, and a "Shortlist/Like" button.
    - **Integration**: Selected suppliers should be available for the matching/swiping sessions.

## 4. Technical Stack
- **Frontend**: Next.js 15 (React), Tailwind CSS, Framer Motion.
- **Backend/Database**: Supabase (PostgreSQL, Auth, Realtime).
- **Testing**: TestSprite (Automated E2E and Unit tests).

## 5. Success Metrics
- Successful user registration and login without errors.
- Seamless room creation and partner joining (Realtime sync).
- Accurate search results for suppliers (sub-200ms response).
