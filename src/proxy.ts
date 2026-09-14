import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Pages that only make sense for a signed-in reader; visitors are sent to sign in
const isProtectedRoute = createRouteMatcher([
  '/add-book(.*)',
  '/edit-book(.*)',
  '/my-books(.*)',
  '/library(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
