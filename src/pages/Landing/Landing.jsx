import Hero from "../../sections/Hero";
import Problem from "../../sections/Problem";
import Features from "../../sections/Features";
import HowItWorks from "../../sections/HowItWorks";
import CTA from "../../sections/CTA";

export default function Landing() {
  return (
    <div className="bg-slate-950 text-white">
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <CTA />
    </div>
  );
}
