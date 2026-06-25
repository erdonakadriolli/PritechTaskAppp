# PRITECH Task Manager

A small React Native app that lets a user manage a list of personal tasks. Built for the PRITECH React Native technical task.

## Tech stack

- **Expo SDK 56** (managed workflow) — so it can be opened on a real device with Expo Go, no native toolchain required
- **React 19** + **React Native 0.85**
- **TypeScript**
- **React Navigation v7** (native stack) for screen navigation
- **AsyncStorage** for on-device persistence
- **JSONPlaceholder** (`/todos`) as the public API used to seed the list on first launch

## What's implemented

### Required
- Task list screen with each task showing title, description preview, and a completion checkbox
- Add new task screen (modal) with title + description
- Toggle a task between *pending* and *completed* directly from the list or from the details screen
- Delete task (with confirmation dialog) from the details screen
- Task details screen showing full title, description, status badge, and creation date
- Input validation on the add form (title 2–80 chars, description ≤280 chars)
- Clean, minimal UI with consistent spacing/typography (see `src/theme.ts`)
- Fetches sample todos from the public **JSONPlaceholder** API to seed the list on first launch

### Bonus (all four)
- 🔎 **Search** tasks by title
- 🏷️ **Filter** tasks by status (All / Active / Done)
- 💾 **Local persistence** with `AsyncStorage` — tasks survive app restarts
- 🧭 **Stack navigation** between the three screens

### Quality / structure
- Functional components and hooks throughout
- Single source of truth via a `TasksProvider` context (`src/context/TasksContext.tsx`)
- Reusable presentational components in `src/components/`
- Storage and API concerns isolated in their own modules
- Empty states for both *no tasks at all* and *no matches for the current search/filter*

## Project structure

```
src/
├── api/todosApi.ts              # JSONPlaceholder seed fetch
├── components/
│   ├── EmptyState.tsx
│   ├── FilterTabs.tsx
│   ├── PrimaryButton.tsx
│   ├── SearchBar.tsx
│   └── TaskItem.tsx
├── context/TasksContext.tsx     # Tasks state + actions + hydration/persistence
├── navigation/types.ts          # Stack param list
├── screens/
│   ├── AddTaskScreen.tsx
│   ├── TaskDetailsScreen.tsx
│   └── TaskListScreen.tsx
├── storage/taskStorage.ts       # AsyncStorage load/save
├── theme.ts                     # Shared colors / spacing / radii
└── types.ts                     # Task and TaskFilter types
App.tsx                          # SafeArea + TasksProvider + NavigationContainer
```

## Getting started

### Prerequisites
- Node.js 18 or newer
- The **Expo Go** app on your phone (iOS App Store / Google Play), *or* an Android emulator / iOS simulator

### Run locally

```bash
npm install
npm start
```

`npm start` opens the Expo dev tools and prints a QR code in the terminal:

- **On a phone:** open Expo Go and scan the QR code (Android: scan inside the app; iOS: scan with the system camera).
- **On an Android emulator:** press `a` in the terminal.
- **On an iOS simulator (macOS only):** press `i` in the terminal.
- **In a browser** (limited — `AsyncStorage` falls back to `localStorage`): press `w`.

## First-launch behavior

On first launch the app calls `https://jsonplaceholder.typicode.com/todos?_limit=5` and uses the response (ids + completion status) to seed five realistic sample tasks. Titles and descriptions come from a small local template so the demo data feels like real work items rather than the API's placeholder strings. After that, all data is stored locally via `AsyncStorage` and the app no longer hits the network. If the seed request fails (e.g. offline), a small warning is shown above the list and the user can still add tasks normally.

To reset the seeded data, clear the app's storage from device settings or reinstall the app.

## Validation rules

- **Title:** required, 2–80 characters (trimmed).
- **Description:** optional, up to 280 characters.

Errors are shown inline below each field once the user attempts to save, and the live character counter doubles as a helper.

## Notes

- React Navigation's native stack is used (not the JS stack) for better swipe-back and modal presentation.
- The Add screen is presented modally so it feels distinct from the navigation hierarchy.
- The store is intentionally a tiny `useState`-based context — no Redux/Zustand needed for this scope.

## Screenshots

_Add screenshots or a screen recording here before submitting._
