// src/components/Testimonials.tsx

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card, CardContent, CardFooter } from "../../ui/card";

const testimonials = [
  {
    image: "/testimonials/Sophi.png",
    quote:
      "I've never had a trip planned so easily. I just told the AI where I wanted to go, and it took care of everything. Absolutely magical!",
    name: "Sophia Martinez",
    title: "Frequent Flyer",
  },
  {
    image: "/testimonials/ethan.png",
    quote:
      "I was skeptical, but the AI found the perfect hotel and flights for me. The itinerary was thoughtful and saved me hours of research. I'll definitely use it again.",
    name: "Ethan Chen",
    title: "Adventure Seeker",
  },
  {
    image: "/testimonials/olivia.png",
    quote:
      "I love that I can save my preferences, and the AI remembers them for future trips. It's like having a personal travel agent that knows exactly what I like.",
    name: "Olivia Rodriguez",
    title: "Weekend Explorer",
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="w-full py-16 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="flex flex-col items-center space-y-4 text-center mb-12"
        >
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-white">
            What Our Users Say
          </h2>
          <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed dark:text-slate-300">
            Hear from travelers who have experienced the magic of AI-powered trip planning.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.15,
              }}
              viewport={{ once: false, amount: 0.3 }}
              className="flex" // Use flex to make card fill the height
            >
              <Card className="flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-primary/50">
                <CardContent className="p-0 relative">
                  <Quote className="absolute -top-2 -left-2 h-10 w-10 text-primary/10" />
                  <p className="relative text-lg italic text-gray-700 dark:text-slate-200">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
                <CardFooter className="mt-6 flex items-center gap-4 p-0">
                  <img
                    src={testimonial.image}
                    alt={`Avatar of ${testimonial.name}`}
                    className="h-14 w-14 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{testimonial.title}</p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};