This is a responsive mobile-friendly mvp template. Feel free to use it to further build your own project. Demo and instructions below!

https://github.com/user-attachments/assets/1f71756f-4b9b-484e-8935-0206a626cb6d

## Technologies:
Prisma, React, Tanstack Query

**Initial screen**
<img width="1112" height="947" alt="Screenshot 2025-09-25 at 3 05 39 AM" src="https://github.com/user-attachments/assets/b4b315ca-d3b7-44f5-97f7-58fdec862937" />

**Initial screen shows one fetch for each view**
<img width="1595" height="978" alt="Screenshot 2025-09-25 at 3 06 27 AM" src="https://github.com/user-attachments/assets/959fe6b9-3876-45f1-b07b-8b33d36b7fb1" />

**Scrolling shows extra pages fetched**
<img width="1633" height="998" alt="Screenshot 2025-09-25 at 3 06 38 AM" src="https://github.com/user-attachments/assets/0eb88c3a-7687-4c7f-aa0e-9071deae69e3" />

**Infinite Scroll for workplace** 
<img width="455" height="390" alt="Screenshot 2025-09-25 at 3 06 01 AM" src="https://github.com/user-attachments/assets/caedbc5b-7684-40d8-b10e-514d05656c5f" />

**Filter Modal Options** 
<img width="985" height="797" alt="Screenshot 2025-09-25 at 3 06 14 AM" src="https://github.com/user-attachments/assets/137ae4a5-1bde-456b-9a73-be1f04f142e8" />

**Mobile View**
<img width="526" height="1010" alt="Screenshot 2025-09-25 at 3 51 35 AM" src="https://github.com/user-attachments/assets/0dc49012-823c-4194-be9c-cacd8104620b" />
<img width="508" height="999" alt="Screenshot 2025-09-25 at 3 51 42 AM" src="https://github.com/user-attachments/assets/65ed1f6e-983c-49cf-ac50-4ece3b796b70" />


## Design Decisions:
### 1. Available Shifts and Booked Shifts: Infinite Scroll
- Options: Load More button; Pagination; Infinite Scroll
- Chosen: Infinite Scroll with Back-to-Top button
- Rationale:
    - Seamless browsing without repeated clicks.
    - Sticky header keeps Filters accessible; Back‑to‑Top aids navigation on long lists.
    - Implemented with IntersectionObserver and page links
### 2. Filter Modal
- Options: Instant filter; Filter er bar with Apply; Filter modal with Apply
- Chosen: Filter modal with Apply
- Rationale:
    - Batches user intent to one request instead of firing on every keystroke/change.
    - Keeps URL as source of truth via canonical query params; UI uses a clean object shape 
- Trade‑offs:
    - Users don’t see results change instantly; some combinations may return zero results.
    - Optional improvement: live result count next to Apply; requires background queries per change.
### 3. Workplace Filters
- Options: Type‑to‑search only; Dropdown only; Combination (type‑ahead + scroll)
- Chosen: Combination with debounce and infinite scroll
- Rationale:
    - Scales to many workplaces/job types; supports both browsing and targeted search.
    - Debounced search terms cut unnecessary network calls
    - Option lists are alphabetically ordered (locations by workplace name, job types by name) 
- Trade‑offs:
    - Alphabetic seed list may not be the most relevant; could rank by “most available” or “most searched,” which needs extra queries/metrics.
### 4. Filter Options/Fields Decision
- Scenario A (targeted): Users know location, date range, and/or minimum rate; more filters -> fewer results-> lighter payload and faster scans.
- Scenario B (browsing): Users explore broadly; infinite scroll supports this secondary flow while keeping Filters close (sticky header).
- 
- Result: Good performance/UX balance; filters applied once on Apply button is clicked
### Main Features/Implementations
- [x]  Infinite scroll to handle large datatsets for prod using pagination & IntersectionObserver
- [x]  Instant search with recommendations
- [x]  Filter query in the backend to improve performance
- [x]  Workers should be able to see all available shifts for booking
- [x]  Workers should be able to book shifts
- [x]  Workers should be able to see their already-booked, upcoming shifts
- [x]  Workers should be able to cancel their already-booked shifts
- [x]  Mobile friendly tab selection for the available shifts view and my booked shifts view to improve user experience
- [x]  Hide past dates
- [x]  Hide and show past shifts

## User stories

- **Login / Mock Login**
    
    User Story: As a Red Planet worker, I want to log in to the mobile app (or be recognized via a mock login) so I can view and manage my own shifts securely.
    
    - Added a welcome message with worker name with `workerId = 1` on the top-right of the screen.
- **View Available Shifts**
    
    User Story: As a worker, I want to see a list of all available shifts with essential details (**location, job type, start/end times, pay rate**) so I can decide which shifts to pick up.
    
    - Implemented a UI where shift details are easy to read.
- **Filter Shifts**
    
    User Story: As a worker, I want to **filter available shifts by location** (e.g., Habitat 1 vs. Habitat 9), **job type** (e.g., oxygen technician), and specify minimum pay rate to quickly find shifts that match my preferences.
    
    - Implemented filtering by jobtype, location, and minimum pay rate
    - Future improvement: Add filtering by distance/miles from current location.
- **Book a Shift**
    
    User Story: As a worker, I want to tap on a shift and book it immediately (if it’s still available) so I don’t need to wait for a coordinator to confirm. The app should prevent double-booking overlapping shifts and display a clear success/failure message.
    
    - Implemented a clear booking flow with double-booking prevention.
- **See Upcoming Shifts**
    
    User Story: As a worker, I want to view my already-booked shifts in a list or calendar view showing date, time, location, and pay rate so I can track my schedule and avoid conflicts.
    
    - Added grouping by date for easier viewing.
    - Added an option to view past shifts for pay tracking.
- **Cancel a Shift**
    
    User Story: As a worker, I want to cancel a booked shift via a simple button (optionally entering a reason) and receive confirmation that the cancellation succeeded, so I can handle last-minute schedule changes. If there’s a minimum cancellation window, the app should flag it and instruct the worker to contact someone directly.
    
    - Added two cancellation options: immediate or requiring approval if under a certain hour threshold.
    - Provided contact information and differentiated UI for clarity.
- **Show Booking Status**
    
    User Story: As a worker, I want the app to clearly show whether a shift is available and notify me when my booking or cancellation is processed, so I can trust the system and avoid second-guessing.
    
    - Once a worker books or cancels, a notification for success or failure is shown on screen.
    - If the cancellation is a last-minute request, a pending badge is shown instead of a confirmation.

### Future Improvements:

- Time zone conversion

- Filter by distance from the current location

- Authentication

- Calendar view for users

- Haptic feedback and drag-to-refresh (out of scope since it needs mobile testing)

- Recommendations/Job matching and filtering out jobs that overlap with current bookings

- Web worker to ensure information updates instantly

- Replace hard-coded roles and locations in shift filters with values from the server for consistency

- 
## Technologies

- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/docs/concepts/components/prisma-client)

## Getting Started

### Setup

```bash
# Install dependencies
npm install

# Create and migrate the database, and then apply seed data located at `./prisma/seed`
npx prisma migrate dev --name init

# Drop and re-seed the database
npx prisma migrate reset

# Start the server in watch mode with hot-reloading
npm run start:dev
```

## API Reference

### Workers

- `POST /workers`: Create a worker
  - Body: [`createWorkerSchema`](./src/modules/workers/workers.schemas.ts)
- `GET /workers/:id`: Get worker by ID
  - Params: `:id` - Worker ID
- `GET /workers`: List all workers
- `GET /workers/claims`: Get worker claims
  - Query: `workerId` - Worker ID

### Workplaces

- `POST /workplaces`: Create a workplace
  - Body: [`createWorkplaceSchema`](./src/modules/workplaces/workplaces.schemas.ts)
- `GET /workplaces/:id`: Get workplace by ID
  - Params: `:id` - Workplace ID
- `GET /workplaces`: List all workplaces

### Shifts

- `POST /shifts`: Create a shift
  - Body: [`createShiftSchema`](./src/modules/shifts/shifts.schemas.ts)
- `GET /shifts/:id`: Get shift by ID
  - Params: `:id` - Shift ID
- `POST /shifts/:id/claim`: Claim a shift
  - Params: `:id` - Shift ID
  - Body: `workerId` - Worker ID
- `POST /shifts/:id/cancel`: Cancel a claimed shift
  - Params: `:id` - Shift ID
- `GET /shifts`: List all shifts
