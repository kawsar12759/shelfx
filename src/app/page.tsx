import { auth } from "@clerk/nextjs/server";
import Hero from "../../components/home/Hero";
import ContinueReading from "../../components/home/ContinueReading";
import ShelfSection from "../../components/home/ShelfSection";
import GenreGrid from "../../components/home/GenreGrid";
import HowItWorks from "../../components/home/HowItWorks";
import { getCurrentlyReading, getRecentBooks, getSiteStats, getTopRatedBooks } from "@/lib/queries";

// Always render with fresh data so newly added books show up immediately
export const dynamic = "force-dynamic";

export default async function Home() {
  const { userId } = await auth();
  const [shelf, topRated, stats, reading] = await Promise.all([
    getRecentBooks(24),
    getTopRatedBooks(4),
    getSiteStats(),
    userId ? getCurrentlyReading(userId) : Promise.resolve([]),
  ]);

  return (
    <div>
      <Hero stats={stats} books={shelf} />
      <ContinueReading entries={reading} />
      <ShelfSection
        title="Recently added"
        subtitle="The latest books readers have put on the shelf."
        href="/explore"
        books={shelf.slice(0, 8)}
      />
      <GenreGrid genres={stats.genres} />
      <ShelfSection
        title="Top rated"
        subtitle="The highest average scores from reader reviews."
        href="/explore?sort=rating"
        books={topRated}
      />
      <HowItWorks signedIn={Boolean(userId)} />
    </div>
  );
}
