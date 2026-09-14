# ShelfX 📚

A full-stack reading tracker and book community built with Next.js 16, React 19, MongoDB, Clerk and Cloudinary. Discover books, put them on your shelf, log your reading progress and share reviews with other readers.

<!-- Add screenshots here, e.g. ![Home](docs/home.png) -->

## Features

### For readers
- **📖 Explore** — Full-text search by title or author, filter by 19 genres, sort by newest, top rated, most shelved or A–Z. Filters live in the URL, so every search is shareable and works with back/forward.
- **📚 My Library** — Shelve books as *Want to Read*, *Currently Reading* or *Finished*. Log the page you're on and watch the progress bar fill; reaching the last page automatically marks a book finished.
- **📊 Reading stats** — Books on shelf, currently reading, books finished this year, total pages read, your top genres and a breakdown by status.
- **⭐ Ratings & reviews** — One review per reader per book (editable and deletable), with an average score and a 5-to-1 star distribution chart.
- **✨ Recommendations** — "You might also like" suggestions on every book page based on shared genres and author.

### For contributors
- **➕ Add books** with a cover upload (Cloudinary), genres, summary and metadata, with validation on both client and server.
- **✏️ Edit and delete** your own books. Deleting a book also removes its reviews and shelf entries.
- **🗂 My Books** dashboard showing each book's rating and how many readers have shelved it.

### Under the hood
- **Server-rendered pages**: the home and book pages query MongoDB directly in React Server Components.
- **SEO**: per-book `<title>`, description and Open Graph cover image via `generateMetadata`.
- **Route protection** with Clerk middleware (`src/proxy.ts`) for the library, add, edit and my-books pages. Every mutating API route checks ownership.
- **Denormalized counters** (`ratingAvg`, `ratingCount`, `readersCount`) on books keep sorting by rating and popularity fast.
- **Polished states**: skeleton loaders, empty states, a custom 404 and an error boundary.
- **Responsive design** with a warm, paper-inspired theme (Playfair Display + DM Sans).

## Tech Stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui primitives, Lucide icons |
| Data | MongoDB with Mongoose |
| Auth | Clerk |
| Media | Cloudinary |
| UX | React Toastify, SweetAlert2 |

## Getting Started

### Prerequisites
- Node.js 20+
- A MongoDB database (e.g. MongoDB Atlas)
- A Clerk application
- A Cloudinary account

### Installation

```bash
git clone <repository-url>
cd shelfx
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Then run the dev server and open [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

## Project Structure

```
shelfx/
├── components/                  # Feature components
│   ├── book/                    # Library controls + reviews on the book page
│   ├── explore/                 # Search / filter / paginate view
│   ├── home/                    # Hero, shelves, genre grid, how-it-works
│   ├── library/                 # My Library dashboard + cards
│   ├── add-book/ edit-book/     # Book forms
│   └── BookCard, BookDetails, NavBar, Footer, StarRating …
├── models/                      # Mongoose schemas: Book, Library, Review
├── src/
│   ├── app/                     # App Router pages + API routes
│   ├── components/ui/           # shadcn/ui primitives
│   ├── lib/                     # DB connection, queries, Cloudinary, helpers
│   └── proxy.ts                 # Clerk middleware + protected routes
└── typings.d.ts                 # Shared Book / LibraryEntry / Review types
```

## API Reference

### Books
| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/books?q=&genre=&sort=&page=&limit=` | Search, filter, sort and paginate books |
| `POST` | `/api/books` | Create a book (multipart, auth) |
| `GET` | `/api/books/[bookId]` | Book details |
| `PATCH` | `/api/books/edit/[id]` | Update your book (auth, owner) |
| `DELETE` | `/api/books/delete/[id]` | Delete your book, its reviews and shelf entries (auth, owner) |
| `GET` | `/api/books/my-books` | Books you've added (auth) |

### Reviews
| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/books/[bookId]/reviews` | List reviews for a book |
| `POST` | `/api/books/[bookId]/reviews` | Create or update your review `{ rating, text }` (auth) |
| `DELETE` | `/api/books/[bookId]/reviews` | Delete your review (auth) |

### Library
| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/library` | Your shelf with populated books (auth) |
| `POST` | `/api/library/add` | Shelve a book `{ bookId, status? }` (auth) |
| `GET` | `/api/library/status/[bookId]` | Your shelf entry for a book, if any |
| `PATCH` | `/api/library/[bookId]` | Update `{ status?, currentPage? }` (auth) |
| `DELETE` | `/api/library/[bookId]` | Remove a book from your shelf (auth) |

## Scripts

```bash
npm run dev     # Development server
npm run build   # Production build
npm start       # Start production server
npm run lint    # ESLint
```

## Deployment

Deploy on [Vercel](https://vercel.com): import the repository, add the environment variables above, and deploy.

## License

MIT
