import Banner from "@/components/home/banner";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import StudioCategories from "@/components/home/studioCategories";


export default function Home() {
  return (
    <main className="min-h-screen">
    <div>
      <Banner/>
      <StudioCategories/>
      <FeaturedStudios/>
    </div>
    </main>
  );
}