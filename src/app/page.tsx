import Hero from "../../components/home/Hero";
import ShelfSection from "../../components/home/ShelfSection";
import GenreGrid from "../../components/home/GenreGrid";
import HowItWorks from "../../components/home/HowItWorks";
import { getRecentBooks, getSiteStats, getTopRatedBooks } from "@/lib/queries";

// Always render with fresh data so newly added books show up immediately
export const dynamic = "force-dynamic";

export default async function Home() {
  const [shelf, topRated, stats] = await Promise.all([
    getRecentBooks(24),
    getTopRatedBooks(4),
    getSiteStats(),
  ]);

  return (
    <div>
      <Hero stats={stats} books={shelf} />
      <ShelfSection
        title="Recently added"
        subtitle="The latest books readers have added."
        href="/explore"
        books={shelf.slice(0, 8)}
      />
      <GenreGrid genres={stats.genres} />
      <ShelfSection
        title="Top rated"
        subtitle="Highest average score from reader reviews."
        href="/explore?sort=rating"
        books={topRated}
      />
      <HowItWorks />
    </div>
  );
}
