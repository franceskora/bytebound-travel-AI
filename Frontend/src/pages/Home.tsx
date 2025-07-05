

import { About } from "../components/pages/Home/About";
import { CallToAction } from "../components/pages/Home/call-to-action";
import { Contact } from "../components/pages/Home/Contact";
import { Features } from "../components/pages/Home/Features";
import { Hero } from "../components/pages/Home/Hero";
import { HowItWorks } from "../components/pages/Home/how-it-work";
import { PlanYourTrip } from "../components/pages/Home/plan-your-trip";
import { Pricing } from "../components/pages/Home/pricing";
import { Testimonials } from "../components/pages/Home/Testimonials";


export const Home = () => {
  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-full flex justify-center px-4 md:px-8 lg:px-40">
        <div className="w-full max-w-[960px] flex flex-col items-start">
          <Hero />
            <HowItWorks />
        <Features />

          <Pricing />

          <Testimonials />
      <PlanYourTrip />
        <About />
        <Contact />
          <CallToAction />
        </div>
      </div>
    </div>
  );
};