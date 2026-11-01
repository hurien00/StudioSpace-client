import Banner from "@/components/home/banner";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import HostGuarantee from "@/components/home/HostGuarantee";
import HowBookingWorks from "@/components/home/HowBookingWorks";
import StudioCategories from "@/components/home/studioCategories";


export default function Home() {
  return (
    <main className="min-h-screen">
    <div>
      <Banner/>
      <StudioCategories/>
      <FeaturedStudios/>
      <HowBookingWorks/>
      <HostGuarantee/>
    </div>
    </main>
  );
}