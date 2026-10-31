import Banner from "@/components/home/banner";
import FeaturedStudios from "@/components/home/FeaturedStudios";


export default function Home() {
  return (
    <main className="min-h-screen">
    <div>
      <Banner/>
      <FeaturedStudios/>
    </div>
    </main>
  );
}