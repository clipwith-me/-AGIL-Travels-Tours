import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Destinations } from "@/components/home/Destinations";
import { WhyAgil } from "@/components/home/WhyAgil";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Destinations />
      <WhyAgil />
    </>
  );
}
