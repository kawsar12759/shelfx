# ShelfX 📚

A modern, full-stack book library management application built with Next.js. Discover, organize, and manage your personal book collection with ease.

## Overview

ShelfX is a comprehensive book library platform that allows users to explore a curated collection of books, build their personal library, and manage their reading collection. With features like genre filtering, book details, and personal library management, ShelfX makes organizing your reading life simple and enjoyable.

## Features

- **📖 Book Exploration** - Browse and discover books filtered by multiple genres (Fiction, Romance, Fantasy, Mystery, Science Fiction, Biography, and more)
- **➕ Add Books** - Easily add new books to your personal library with detailed information
- **✏️ Edit & Manage** - Update book information and manage your collection
- **👤 Personal Library** - View and manage all books in your library
- **🔐 Authentication** - Secure user authentication powered by Clerk
- **☁️ Image Management** - Upload and store book cover images via Cloudinary
- **🎨 Beautiful UI** - Modern, responsive design with Tailwind CSS
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Hook Form** - Form state management
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon library
- **React Toastify** - Toast notifications
- **SweetAlert2** - Beautiful alert dialogs

### Backend & Database
- **Node.js** - JavaScript runtime
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### Authentication & Storage
- **Clerk** - User authentication and management
- **Cloudinary** - Image hosting and management

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB database
- Clerk account (for authentication)
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd shelfx
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env.local` file in the root directory with:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
shelfx/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── api/                      # API routes
│   │   │   ├── books/               # Book management endpoints
│   │   │   ├── library/             # Library endpoints
│   │   │   └── debug-clerk/         # Clerk debugging
│   │   ├── explore/                 # Book exploration page
│   │   ├── add-book/                # Add book page
│   │   ├── edit-book/               # Edit book page
│   │   ├── my-books/                # Personal library page
│   │   ├── book/                    # Book details page
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   └── globals.css              # Global styles
│   ├── components/                   # React components
│   │   ├── ui/                      # Reusable UI components
│   │   ├── BookCard.tsx             # Book card component
│   │   ├── BookDetails.tsx          # Book details component
│   │   ├── NavBar.tsx               # Navigation bar
│   │   ├── add-book/                # Add book form components
│   │   ├── edit-book/               # Edit book form components
│   │   └── home/                    # Home page components
│   ├── lib/                          # Utility functions
│   │   ├── cloudinary.ts            # Cloudinary integration
│   │   ├── connectToDB.ts           # MongoDB connection
│   │   └── upload-image.ts          # Image upload utilities
│   └── models/                       # MongoDB models
│       ├── book.ts                  # Book schema
│       └── library.ts               # Library schema
├── public/                           # Static assets
├── components.json                  # Component configuration
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Project dependencies
```

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm build

# Start production server
npm start

# Run ESLint
npm run lint
```

## API Endpoints

### Books
- `GET /api/books` - Get all books (with optional genre filter)
- `GET /api/books/[bookId]` - Get specific book details
- `POST /api/books` - Create new book
- `PUT /api/books/edit/[id]` - Update book
- `DELETE /api/books/delete/[id]` - Delete book

### Library
- `GET /api/books/my-books` - Get user's personal library
- `POST /api/library/add` - Add book to library
- `GET /api/library/status/[bookId]` - Check if book is in library

## Key Features Explained

### Genre Filtering
Users can browse books by 20+ genres including Classic, Fiction, Romance, Fantasy, Mystery, Science Fiction, and more.

### Book Management
- Add detailed book information including title, author, description, and cover images
- Edit existing book details
- Delete books from your personal library
- View comprehensive book details

### User Authentication
Secure authentication using Clerk ensures each user has a personalized experience with their own library and book collection.

## Development

### Stack Details
- **Next.js App Router** - Modern file-based routing
- **Server Components** - Improved performance with React Server Components
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Utility-first styling with custom design tokens

### Code Style
- ESLint configuration for code quality
- TypeScript strict mode enabled
- Component-based architecture

## Deployment

### Deploy on Vercel (Recommended)
The easiest deployment option for Next.js applications:

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy with one click

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for detailed instructions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feedback, please open an issue on the repository.

---

Built with ❤️ using Next.js and React
