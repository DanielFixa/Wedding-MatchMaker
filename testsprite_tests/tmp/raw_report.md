
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** Wedding-MatchMaker
- **Date:** 2026-02-08
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 User Registration Success
- **Test Code:** [TC001_User_Registration_Success.py](./TC001_User_Registration_Success.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/5bac6661-e640-40f3-a736-4d6f118c8bb4
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 User Registration Failure with Invalid Email
- **Test Code:** [TC002_User_Registration_Failure_with_Invalid_Email.py](./TC002_User_Registration_Failure_with_Invalid_Email.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/2ab0fa09-2b1f-49e9-af75-4dbddf253434
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 User Login Success
- **Test Code:** [TC003_User_Login_Success.py](./TC003_User_Login_Success.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/d9c84501-a572-4bee-8e99-16620d320276
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 User Login Failure with Incorrect Password
- **Test Code:** [TC004_User_Login_Failure_with_Incorrect_Password.py](./TC004_User_Login_Failure_with_Incorrect_Password.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/b7437697-52b0-429a-b7e1-687ca0f9bab1
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Dashboard Display Active Rooms
- **Test Code:** [TC005_Dashboard_Display_Active_Rooms.py](./TC005_Dashboard_Display_Active_Rooms.py)
- **Test Error:** Summary of verification attempt (stopping as requested):

Outcome: FAILED to verify dashboard rooms because the session is not authenticated.

What was observed on the page (http://localhost:3000/login):
- Page heading: "Wedding Matchmaker"
- Authentication error shown: "Invalid login credentials" (visible as an alert on the form)
- Login form elements present:
  - Email input (index 50) with value example@gmail.com
  - Password input (index 54) with value password123
  - Sign In button (index 55)
  - Create an account link (index 61)
- No dashboard indicators found: no "Dashboard" heading, no "Rooms" heading, and no room cards or active rooms visible.

Why verification could not be completed:
- The login attempt returned an authentication error (invalid credentials). Without a successful login and the dashboard page being displayed, the list of active rooms cannot be checked.

Recommended next steps to complete the task (if desired later):
1) Use valid user credentials or register a test user (click element [61] "Create an account") and create a user that has active rooms. Then sign in and re-run the dashboard extraction.
2) After successful login, extract room cards and list each room's title and category.

Interactive element indexes (for reference):
- Email input: [50]
- Password input: [54]
- Sign In button: [55]
- Create an account link: [61]

Files: extracted_content_0.md contains the login page extraction results.

Since the user requested to stop, the session will stop here.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/e04e4a3b-c395-41f5-9168-5ce45cc8244f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Create New Room by Category
- **Test Code:** [TC006_Create_New_Room_by_Category.py](./TC006_Create_New_Room_by_Category.py)
- **Test Error:** Summary of verification attempt:

What succeeded:
- Account registration: Test Couple / testuser@example.com (registration succeeded).
- Room creation and lobby: Created room by selecting the 'Rings' category and hosting. Lobby was reached and verified. Room code: 3PWHV. Lobby shows heading 'Waiting for Partner' and status 'Listening for updates...'.

What could not be verified:
- Dashboard listing: After navigating to /dashboard and performing multiple scrolls and four separate content extraction attempts (extracted_content_0..3), no room entries or cards were found and the code '3PWHV' was not present in the dashboard content returned. The dashboard viewport only shows the Create Room / Join Room UI in the provided content and extractions appear truncated or do not include room cards.

Observed interactive elements relevant to the dashboard view: Sign Out button, Create Room cards (Dresses, Rings, Venue, Decor), Deck Size controls (10/20), Create & Host control, and a Join Room modal with a 5-char code input.

Possible reasons and recommended next steps to complete verification:
1) UI rendering/virtualization: Room list may be rendered outside the captured viewport or via a lazy-loaded region that wasn't included in extractions. Try a full page scroll to bottom, or programmatically trigger any "My Rooms" or pagination controls.
2) Session consistency: The dashboard may require a page refresh or re-login for newly created rooms to appear. Try refreshing /dashboard or sign out and sign back in.
3) Different listing location: Newly created rooms might be shown under a different page/section (e.g., "Couple's Memory" or a separate "My Rooms" area). Manually navigate those areas.
4) Backend or timing: Room creation may be eventual-consistent; wait a short interval and refresh.

Conclusion and outcome:
- Requirement: "Verify user can create a new matching room by selecting a wedding category and the room is available in dashboard and lobby."
- Result: Partial success. Lobby creation and waiting state verified (room code 3PWHV). Dashboard availability verification failed—the new room could not be found in the dashboard content after multiple extraction and scrolling attempts.

If continued verification is required, suggest performing a dashboard refresh and re-extraction, or manually checking the 'My Rooms' area. Provide guidance to check server logs or API responses for the created room if programmatic verification is needed.

Files/extractions referenced: extracted_content_0.md, extracted_content_1.md, extracted_content_2.md, extracted_content_3.md

Final status: NOT fully verified (dashboard listing not found).
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/b743bbd2-702a-4337-9032-4eed4734d61e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Join Existing Room with Valid Code
- **Test Code:** [TC007_Join_Existing_Room_with_Valid_Code.py](./TC007_Join_Existing_Room_with_Valid_Code.py)
- **Test Error:** Result of verification: JOIN FAILED.

Summary of what was tested:
- Registered and signed in as testcouple+join@example.com (account creation succeeded and dashboard is visible).
- On the dashboard Join Room panel, entered code 'ABCDE' into input (index 1066) and clicked 'Join Game' (index 1067).
- The application responded with the message: 'Room not found.' No lobby or session UI appeared. Therefore the attempt to join an existing room using the provided 5-character code did not succeed.

Evidence from current UI state:
- Join input (index 1066) value: 'ABCDE'
- Join button index: 1067
- Visible feedback: 'Room not found.' (error shown beneath the join input)
- No lobby/session elements are present in the DOM or screenshot after the join attempt.

Conclusion: The app did not allow joining with the tested code — verification of successful join is negative. If a successful join needs to be tested, next recommended steps:
1) Create/host a room first (use the Create Room/Create & Host flow) and capture the generated 5-character code, then attempt to join with that exact code from another signed-in account or browser session.
2) Alternatively, obtain a known-valid room code from test fixtures or the backend and try joining with that.

If further automated testing is required, specify whether to: (A) create a room now and then attempt joining, or (B) retry joining with a different code. Current run stopped as requested.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/004959a6-8280-4c00-8b5c-f7ebf3cc7dc4
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Join Existing Room with Invalid Code
- **Test Code:** [TC008_Join_Existing_Room_with_Invalid_Code.py](./TC008_Join_Existing_Room_with_Invalid_Code.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/3cc1d215-1b08-4daa-90f7-c654021c1e59
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Room Lobby Waiting until Partner Joins
- **Test Code:** [TC009_Room_Lobby_Waiting_until_Partner_Joins.py](./TC009_Room_Lobby_Waiting_until_Partner_Joins.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/4603855c-8575-4624-87ad-a370d19ab7f3
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Real-time Sync of Room Session Inputs
- **Test Code:** [TC010_Real_time_Sync_of_Room_Session_Inputs.py](./TC010_Real_time_Sync_of_Room_Session_Inputs.py)
- **Test Error:** Test could not be completed: automation environment blocked creation of a second browser tab/session for User B. Current confirmed state: User A is registered and hosting room H7HSB, but no second client joined. Because a second client could not be created, the real-time synchronization of swipe actions could not be verified. Recommended next steps to complete the test:

- Open a second browser window or a distinct browser profile (or use a second device) and navigate to http://localhost:3000.
- In the second session, enter room code H7HSB and click 'Join Game' to join as User B.
- On User A (host) perform the swipe right action on an item and confirm it appears immediately on User B.
- On User B perform the swipe left action on another item and confirm it appears immediately on User A.

If automation must complete this run, grant the automation environment permission to open new tabs/sessions or provide an API/test hook to simulate a second client. Current run status: success=false.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/112dd134-3a9d-4e29-a1db-bbf71643e4ce
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Supplier Search Returns Results under 200ms
- **Test Code:** [TC011_Supplier_Search_Returns_Results_under_200ms.py](./TC011_Supplier_Search_Returns_Results_under_200ms.py)
- **Test Error:** Summary of verification attempt:

Requested check: Verify supplier search returns accurate results within 200 milliseconds.

What was done:
- Registered and logged in with a test account (Test Couple / test+1@example.com).
- Navigated to the supplier search page (/search).
- Set filters: Category = Venue, Location = New York, NY, Price = Any Price.
- Executed the search and extracted visible results.

Results found (extracted from page):
- Total results text: not available
- Timing/latency info: timing not available
- Supplier cards extracted (1):
  1) {
     "title": "Grand Plaza Hotel",
     "location_text": "New York, NY",
     "category_text": "Venue",
     "price_indicator": "$$$$",
     "rating": "4.8 ★",
     "image_alt": "Grand Plaza Hotel",
     "shortlist_visible": true,
     "matches_category_Venue": true,
     "matches_location_New_York_NY": true,
     "matches_both": true
    }

Conclusion:
- Accuracy: The visible search result(s) match the requested filters (Category='Venue' and Location='New York, NY'). The returned card(s) appear relevant.
- Timing: No timing or latency information was available from the page or DOM during tests. Therefore the requirement "returns results within 200 milliseconds" cannot be confirmed from this run.

Recommendation to measure latency (next steps if measurement required):
1) Instrument the client-side by recording timestamps (e.g., performance.now()) right before triggering the search and immediately after the results area finishes rendering, then compute the difference.
2) Use browser devtools/network HAR capture or automated test runner (Puppeteer/Playwright) to capture request/response timings and measure server response plus rendering time. Example: record Date.now() or performance.now() before click and after DOM update.
3) If the app exposes any telemetry or timing in the UI or API responses, enable/collect that during the test.

Because timing was not captured, final verification of the <=200 ms requirement is not possible here. If measurement is desired, provide permission to run a timed click+DOM-wait test (or enable collection of performance timing) and the test can be repeated with measurements.

Stopping now as requested.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/1a07ecea-3c19-450c-8994-64bea070f8bd
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Supplier Search Filters by Category, Location, and Price
- **Test Code:** [TC012_Supplier_Search_Filters_by_Category_Location_and_Price.py](./TC012_Supplier_Search_Filters_by_Category_Location_and_Price.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/59378ff6-5002-45a5-9895-6dc626a8048c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Supplier Cards Display Images, Ratings, and Functional Shortlist Button
- **Test Code:** [TC013_Supplier_Cards_Display_Images_Ratings_and_Functional_Shortlist_Button.py](./TC013_Supplier_Cards_Display_Images_Ratings_and_Functional_Shortlist_Button.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/b9ab456c-ceb6-4cb5-8aa0-aee1010be54c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Shortlisted Suppliers Integrated into Matching Rooms
- **Test Code:** [TC014_Shortlisted_Suppliers_Integrated_into_Matching_Rooms.py](./TC014_Shortlisted_Suppliers_Integrated_into_Matching_Rooms.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af84cff0-5161-4bac-980a-9b35daf3bda4/3a6bfc78-97b6-415a-b851-232a03f1e419
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **64.29** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---