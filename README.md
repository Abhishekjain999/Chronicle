# Chronicle &mdash; Modern Full-Stack MERN Editorial Platform

A modern, secure, responsive, editorial blogging platform inspired by publications like Medium and Substack. Built with a connected React frontend, Node/Express backend, and MongoDB database.

---

## Features

### 1. Authentication & Security
- **JWT in HTTP-only Cookies**: Prevents client-side script token theft and XSS attacks.
- **bcrypt Password Hashing**: Passwords are securely hashed with bcrypt salts.
- **Protected Routes & Role Authorization**: Client and server enforcement of route protection.
- **Persistent Sessions**: Automatic session restoration via `GET /api/auth/me` on reload.
- **Security Middlewares**: Helmet headers, express-rate-limit on auth/comment routes, CORS with credentials, and input sanitization (`xss`) against stored cross-site scripting.

### 2. Editorial Blog Post Management
- **Full CRUD Functionality**: Create, edit, and delete stories with ownership validation.
- **Drafts & Publishing**: Save stories as drafts to finish later or publish immediately.
- **Unique Slugs**: SEO-friendly slugs generated from titles with collision resolution.
- **Rich Markdown Editor**: Split-screen live preview, markdown toolbar, and reading time estimation.
- **Cover Images & Categories**: Support for rich hero images, categories, and tag filtering.

### 3. Interactive Comment & Moderation System
- **Chronological Discussion**: Readers can submit responses to articles with instant updates.
- **User Ownership**: Comment authors can edit or delete their own responses.
- **Author Moderation**: Story authors have moderation permissions to delete any responses on their stories directly from the article or their dashboard.

### 4. Discovery & Homepage
- **Editorial Hero Highlight**: Prominent lead featured article.
- **Category Filter Pills**: Filter across Technology, Backend, Design, Cloud, Security, AI, etc.
- **Full-Text Search & Sorting**: Search titles, content, and tags; sort by newest, oldest, or most popular.
- **Pagination**: Smooth numbered pagination with previous/next controls.
- **Loading Skeletons & Empty States**: Clean feedback states for loading and empty searches.

### 5. Author Dashboard
- **Performance Overview**: Story count, published/draft breakdown, total views, and total responses.
- **Story Management**: Quick actions to preview, edit, or delete articles.
- **Moderation Inbox**: Review and remove reader responses received across authored stories.
- **Profile Settings**: Update display name, avatar URL, and bio.

### 6. Design & User Experience
- **Light & Dark Theme**: Toggle persisted in localStorage with Tailwind CSS dark mode.
- **Editorial Typography**: Styled using Google Fonts (`Newsreader`, `Inter`, `JetBrains Mono`).
- **Confirmation Modals**: Accessible modal dialogs for destructive actions.
- **Toast Notifications**: Feedback alerts via `react-hot-toast`.

---

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, React Hook Form, Lucide React, React Hot Toast, React Markdown.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens, bcryptjs, express-validator, helmet, express-rate-limit, xss, cookie-parser.
- **Testing**: Node Native Test Runner (`node:test`, `node:assert`) with Supertest.

---

## Directory Structure

```text
BlogPlatform/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, PostCard, CommentSection, Modals, Skeletons
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── layouts/            # RootLayout, ProtectedRoute
│   │   ├── pages/              # Home, PostDetails, WritePost, Dashboard, UserProfile, Login, Register
│   │   ├── services/           # Axios API Client with credentials
│   │   └── utils/              # Date and reading time formatters
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Node + Express REST API
│   ├── src/
│   │   ├── config/             # Mongoose connection
│   │   ├── controllers/        # Auth, Post, Comment, User controllers
│   │   ├── middleware/         # Auth, validation, rate limiting, error handling
│   │   ├── models/             # User, Post, Comment Mongoose schemas
│   │   ├── routes/             # Express API routes
│   │   ├── tests/              # Automated API test suite
│   │   ├── utils/              # Slugs and XSS sanitization
│   │   └── seed.js             # Database seeder with demo accounts & stories
│   ├── server.js               # Entry point
│   ├── .env.example
│   └── package.json
├── package.json                # Root orchestration scripts
└── README.md
```

---

## Quickstart & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/blog_platform`)

### 1. Install Dependencies
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### 2. Configure Environment
Create `server/.env` (or copy `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/blog_platform
JWT_SECRET=super_secret_jwt_key_blog_platform_development_123456789
CLIENT_URL=http://localhost:5173
```

### 3. Seed Demo Data
Populate realistic demo users, published articles, drafts, and comments:
```bash
cd server
npm run seed
```

#### Demo Accounts
| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** | `alex@devblog.io` | `password123` | Software Architect |
| **Sarah Connor** | `sarah@devblog.io` | `password123` | Cloud & DevOps |
| **Maya Patel** | `maya@devblog.io` | `password123` | AI Researcher |

*(One-click quick login buttons for these accounts are available on the Sign In page!)*

### 4. Run the Automated Tests
Run the complete backend integration test suite verifying authentication, post CRUD, ownership protections, comment moderation, and profile updates:
```bash
cd server
npm test
```

### 5. Start the Application

**Start Backend Server:**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Start Frontend Client (in a separate terminal):**
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## REST API Reference

### Authentication
- `POST /api/auth/register` &mdash; Create user account and set HTTP-only cookie.
- `POST /api/auth/login` &mdash; Authenticate user and issue cookie.
- `POST /api/auth/logout` &mdash; Clear auth cookie.
- `GET /api/auth/me` &mdash; Get current authenticated user profile *(Private)*.

### Blog Posts
- `GET /api/posts` &mdash; Get published posts with search, category, tag, sort, pagination.
- `GET /api/posts/categories/stats` &mdash; Get category post counts.
- `GET /api/posts/:slug` &mdash; View single article by slug.
- `POST /api/posts` &mdash; Create new article *(Private)*.
- `PATCH /api/posts/:id` &mdash; Update owned article *(Private / Owner only)*.
- `DELETE /api/posts/:id` &mdash; Delete owned article *(Private / Owner only)*.
- `GET /api/posts/my-posts` &mdash; Get logged-in user's drafts and published articles *(Private)*.

### Comments & Moderation
- `GET /api/posts/:id/comments` &mdash; Get comments for a post in chronological order.
- `POST /api/posts/:id/comments` &mdash; Add response to article *(Private)*.
- `PATCH /api/comments/:id` &mdash; Edit response *(Private / Comment Author only)*.
- `DELETE /api/comments/:id` &mdash; Delete response *(Private / Comment Author OR Post Author moderation)*.
- `GET /api/comments/received` &mdash; Get responses received on authored stories *(Private)*.

### Users
- `GET /api/users/:id` &mdash; Public profile of author with published stories.
- `PATCH /api/users/me` &mdash; Update current user name, avatar, bio *(Private)*.
