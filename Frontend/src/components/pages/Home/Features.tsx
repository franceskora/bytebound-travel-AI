import { motion } from "framer-motion";
import { Calendar, Plane, Bookmark } from "lucide-react";
import { Card, CardContent } from "../../ui/card";

export const Features = () => {
  const featureCards = [
    {
      icon: Calendar,
      title: "Weekend trips",
      description: "Plan your next weekend getaway with AI.",
    },
    {
      icon: Plane,
      title: "Flights and hotels",
      description: "Book your flights and hotels with AI.",
    },
    {
      icon: Bookmark,
      title: "Save preferences",
      description: "Save your preferences for future trips.",
    },
  ];

  return (
    <section id="features" className="flex flex-col gap-10 px-4 py-10 w-full scroll-mt-20">
      {/* Heading block with animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="flex flex-col gap-4 w-full max-w-[720px]"
      >
        <h2 className="font-['Plus_Jakarta_Sans',Helvetica] font-extrabold text-4xl tracking-[-1.00px] leading-[45px]">
          Features
        </h2>
        <p className="font-['Plus_Jakarta_Sans',Helvetica] font-normal text-base leading-6">
          Tell us where you want to go, and we'll handle the rest.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        {featureCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={`feature-card-${index}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: index * 0.2,
              }}
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex"
            >
              <Card className="w-full md:w-[301px] rounded-lg border">
                <CardContent className="flex flex-col items-start gap-3 p-4">
                  <Icon className="w-8 h-8" />
                  <h3 className="font-['Plus_Jakarta_Sans',Helvetica] font-bold text-base leading-5">
                    {card.title}
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans',Helvetica] font-normal text-sm leading-[21px]">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};