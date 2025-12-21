import Image from "next/image";
import Hero from "../../components/home/Hero";
import RecentlyAdded from "../../components/home/RecentlyAdded";

export default function Home() {
  return (
    <div className="">

      <Hero />
      <RecentlyAdded />
    </div>
  );
}
