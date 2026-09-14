import Hero from "../../components/home/Hero";
import ShelfSection from "../../components/home/ShelfSection";
import GenreGrid from "../../components/home/GenreGrid";
import HowItWorks from "../../components/home/HowItWorks";
import { getRecentBooks, getSiteStats, getTopRatedBooks } from "@/lib/queries";

// Always render with fresh data so newly added books show up immediately
export const dynamic = "force-dynamic";

export default async function Home() {
  const [recent, topRated, stats] = await Promise.all([
    getRecentBooks(8),
    getTopRatedBooks(4),
    getSiteStats(),
  ]);

  return (
    <div>
      <Hero stats={stats} covers={recent} />
      <ShelfSection
        title="Recently Added"
        subtitle="Fresh additions from the ShelfX community."
        href="/explore"
        books={recent}
      />
      <GenreGrid genres={stats.genres} />
      <ShelfSection
        title="Top Rated"
        subtitle="The books readers can't stop recommending."
        href="/explore?sort=rating"
        books={topRated}
      />
      <HowItWorks />
    </div>
  );
}
