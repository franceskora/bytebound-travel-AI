// src/components/HowItWorks.tsx

import { motion } from "framer-motion";
import { Briefcase, MapPin, Send } from "lucide-react";

const timelineSteps = [
  {
    icon: MapPin,
    title: "Tell Us Your Preferences",
    description: "Share your travel dates, budget, interests, and desired vibe. The more we know, the better your trip will be.",
  },
  {
    icon: Briefcase,
    title: "Get a Personalized Itinerary",
    description: "Our AI instantly crafts a detailed plan with flight, hotel, and activity options tailored just for you.",
  },
  {
    icon: Send,
    title: "Book & Enjoy Your Trip",
    description: "Confirm your choices with a single click. We handle all the bookings, so you can focus on packing.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32  dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="flex flex-col items-center space-y-4 text-center mb-16"
        >
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-white">
            Your Journey in 3 Simple Steps
          </h2>
          <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed dark:text-slate-300">
            From wishful thinking to your next adventure, we've streamlined the entire process.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative mx-auto max-w-5xl">
          {/* The vertical line that connects the steps */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="absolute left-6 lg:left-1/2 w-1 h-full bg-primary/20 -translate-x-1/2"
            style={{ transformOrigin: "top" }}
          />

          <div className="relative flex flex-col gap-12">
            {timelineSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              const Icon = step.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.4 }}
                  // This is the core of the responsive fix:
                  // Mobile: A simple grid with the icon on the left, content on the right.
                  // Desktop: A 3-column grid to create the alternating layout.
                  className="grid grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr] items-start gap-x-6 lg:gap-x-12"
                >
                  {/* Content Card */}
                  <div
                    className={`p-6 rounded-xl bg-slate-50 border border-gray-200 shadow-md dark:bg-slate-800/50 dark:border-slate-700
                                ${isEven ? 'lg:col-start-1 lg:row-start-1 lg:text-right' : 'lg:col-start-3 lg:row-start-1'}`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="mt-2 text-gray-600 dark:text-slate-300">{step.description}</p>
                  </div>
                  
                  {/* The Icon Marker (Timeline Dot) */}
                  <div className="flex items-center justify-center row-start-1 lg:col-start-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white ring-8 ring-white dark:ring-slate-900 z-10">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};