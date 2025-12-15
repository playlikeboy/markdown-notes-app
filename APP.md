# Markdown Notes App (Expo) — Full Detailed Document

## 1. Overview

A **Markdown Notes App** is a lightweight, offline‑first note‑taking application designed for **students, developers, and power users** who prefer writing in Markdown. The app focuses on speed, simplicity, and reliability, with clean UI and zero friction.

The app will be built using **Expo (React Native)** and published on the **Google Play Store**.

---

## 2. Problem Statement

Existing note apps are either:

* Too heavy and complex
* Locked behind subscriptions
* Online‑only
* Not developer‑friendly (no Markdown)

Users want:

* Fast offline notes
* Markdown support
* Simple organization (folders/tags)
* Clean reading experience

---

## 3. Target Users

* College students
* Developers
* Writers
* Bloggers
* Knowledge workers

---

## 4. Core Value Proposition (USP)

* 100% offline
* Markdown‑first
* Instant preview
* No login required
* Extremely fast

---

## 5. Feature Set

### 5.1 Notes

* Create note
* Edit note
* Delete note
* Auto‑save while typing
* Last edited timestamp

### 5.2 Markdown Support

* Headings
* Bold / Italic
* Code blocks
* Lists
* Links
* Blockquotes

### 5.3 Preview Mode

* Toggle between **Edit** and **Preview**
* Live markdown rendering
* Scroll sync (optional future)

### 5.4 Organization

**Folders**

* Create folder
* Rename folder
* Delete folder

**Tags**

* Add multiple tags per note
* Filter notes by tag

### 5.5 Offline Storage

* All notes stored locally
* No internet required

### 5.6 Search

* Search notes by title
* Search inside content

### 5.7 Settings

* Theme: Light / Dark
* Font size
* Default markdown template

---

## 6. Non‑Goals (v1)

* Cloud sync
* Collaboration
* Encryption
* Web version

---

## 7. User Flow

### First Launch

1. Splash screen
2. Empty state → "Create your first note"

### Creating a Note

1. Tap `+` button
2. Enter title
3. Write markdown
4. Auto‑saved

### Reading a Note

1. Open note
2. Toggle Preview
3. Read rendered markdown

---

## 8. App Screens

1. Splash Screen
2. Notes List Screen
3. Editor Screen
4. Preview Screen
5. Folder Management Screen
6. Tag Filter Screen
7. Settings Screen

---

## 9. UI / UX Guidelines

### Design Principles

* Minimal
* Distraction‑free
* Text‑first

### Typography

* Monospace for code
* System font for body

### Colors

* Neutral background
* High contrast text

---

## 10. Technical Stack

### Frontend

* Expo (Managed Workflow)
* React Native
* TypeScript
* Expo Router

### Storage

* SQLite (Expo SQLite)
* AsyncStorage (preferences)

### Markdown

* `react-native-markdown-display`

---

## 11. Data Models

### Note

```ts
{
  id: string
  title: string
  content: string
  folderId: string | null
  tags: string[]
  createdAt: number
  updatedAt: number
}
```

### Folder

```ts
{
  id: string
  name: string
}
```

---

## 12. Folder Structure

```
app/
 ├─ (tabs)/
 │   ├─ index.tsx        # Notes list
 │   ├─ folders.tsx
 │   ├─ settings.tsx
 ├─ note/
 │   └─ [id].tsx         # Editor
 ├─ preview/
 │   └─ [id].tsx
components/
 ├─ NoteCard.tsx
 ├─ MarkdownEditor.tsx
 ├─ MarkdownPreview.tsx
services/
 ├─ db.ts
 ├─ notes.ts
 ├─ folders.ts
utils/
 ├─ markdown.ts
 ├─ date.ts
```

---

## 13. Key Libraries

* `expo-sqlite`
* `react-native-markdown-display`
* `@expo/vector-icons`
* `expo-haptics`

---

## 14. Performance Considerations

* Debounced auto‑save
* Lazy rendering for large notes
* SQLite indexes on title

---

## 15. Play Store Compliance

* No sensitive permissions
* No background tracking
* No personal data collection

---

## 16. Monetization (Optional)

### Free

* Unlimited notes

### Pro (One‑time purchase)

* Themes
* Export notes
* Custom fonts

---

## 17. Roadmap

### v1 (Launch)

* Core notes
* Markdown
* Offline storage

### v1.1

* Export as PDF
* Backup

### v2

* Cloud sync
* Cross‑device

---

## 18. Success Metrics

* Daily active users
* Notes created per user
* Retention (7‑day)

---

## 19. Why This App Will Succeed

* Simple
* Useful
* Developer‑friendly
* Fast to build
* Easy to market

---

## 20. Build Time Estimate

* MVP: 5–7 days
* Play Store launch: 1 day

---

**This app is ideal for a first Expo + Play Store launch.**
