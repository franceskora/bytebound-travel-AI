// src/components/About.tsx

import { motion, Variants } from "framer-motion"; // Import Variants
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../../ui/button";

// A list of features to display. This makes the component more scalable.
const features = [
  { text: "Personalized AI-driven itineraries" },
  { text: "Smart suggestions for hidden gems" },
  { text: "Seamless booking and trip management" },
];

// Variants for the parent container to orchestrate staggering
// By adding ": Variants", we tell TypeScript the exact shape this object should have.
const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Variants for each child list item
const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut", // Now TypeScript knows "easeOut" is a valid value
    },
  },
};

export const About = () => {
  return (
    <section id="about" className="w-full py-16 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column: Image with Decorative Element */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="relative"
          >
            {/* Decorative background glow */}
            <div className="absolute -inset-2.5 -z-10 rounded-xl bg-gradient-to-tr from-primary/20 to-pink-500/20 blur-2xl opacity-50 dark:opacity-30" />
            <img
              src="/hero-img.png"
              alt="A scenic travel destination with mountains and a lake"
              className="relative aspect-video w-full overflow-hidden rounded-xl object-cover shadow-lg"
            />
          </motion.div>
          
          {/* Right Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="flex flex-col items-start space-y-6"
          >
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              About
            </div>
            <h2 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              About Travel AI
            </h2>
            <p className="max-w-xl text-gray-600 dark:text-slate-300 md:text-xl/relaxed">
              We're revolutionizing travel planning by making it effortless, personalized, and enjoyable. Our AI platform understands your desires to craft the perfect journey.
            </p>
            
            {/* Staggered Feature List */}
            <motion.ul
              variants={listContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.5 }}
              className="space-y-3 text-lg"
            >
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  variants={listItemVariants}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-gray-800 dark:text-slate-200">{feature.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <Button
              size="lg"
              className="group mt-4"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};