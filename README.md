# Logify 🚧  
**Log it. Fix it. Track it.**

Logify is a modern, role-based maintenance logging and issue tracking application built with **Next.js**. It allows teams to record, document, and manage maintenance problems using auto-generated timestamps, image uploads, markdown-formatted notes, and controlled access for different user roles.

---

## ✨ Features

### 🔐 Authentication & Roles
- Secure authentication using Next.js
- Role-based access control:
  - **Visitor** – View-only access to all logs
  - **Technician** – Create, edit, and mark down issues
  - **Admin** – Full access to all features

---

### 📝 Maintenance Logs / Tickets
- Create maintenance tickets with:
  - Title
  - Markdown-supported description
  - Image uploads (snaps of issues)
- Auto-generated **date & time** on ticket creation
- Server-side timestamping for accuracy

---

### 📸 Image Uploads
- Upload multiple images per ticket
- Images stored in cloud storage (not in database)
- Thumbnail preview support

---

### 📄 Markdown Support
- Write detailed issue descriptions using Markdown
- Supports:
  - Headings
  - Lists
  - Code blocks
  - Checklists
  - Tables
- Clean markdown rendering for viewers

---

### ✅ Issue Status Tracking
- Ticket statuses:
  - `OPEN`
  - `MARKED_DOWN`
  - `RESOLVED`
- Track:
  - Who marked down the issue
  - When it was marked
- Full visibility for all users

---

### 👀 Transparency & Visibility
- All visitors can view issues and logs
- Clearly displays:
  - Created by
  - Created at (date & time)
  - Status updates
  - Technician/admin actions

---

## 🛠 Tech Stack

### Frontend
- **Next.js (App Router)**
- **JavaScript (JS-only, no TypeScript)**
- **Tailwind CSS**

### Backend
- **Next.js API Routes**
- **NextAuth.js** (authentication)
- **MongoDB**
- **Mongoose**

### Storage
- Cloud image storage (e.g., Cloudinary / AWS S3)

---

## 📂 Project Structure

```txt
src/
 ├─ app/
 │   ├─ page.js
 │   ├─ login/
 │   ├─ dashboard/
 │   ├─ api/
 │   └─ layout.js
 │
 ├─ components/
 ├─ lib/
 │   ├─ db.js
 │   └─ auth.js
 ├─ models/
 │   ├─ User.js
 │   └─ Ticket.js
 └─ styles/


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.Flquifgu0AjujFDw
# Logify
