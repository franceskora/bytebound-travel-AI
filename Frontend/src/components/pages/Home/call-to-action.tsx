import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";

export const CallToAction = () => {
  return (
    <section className="w-full py-4 px-4">
      <Card className="w-full h-[480px] rounded-xl overflow-hidden border-0">
        <CardContent className="p-0 h-full relative">
          {/* Animated background image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url('/bg.png')",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-[896px] mx-auto px-4 gap-2">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.5 }}
              className="sm:text-5xl text-4xl md:text-4xl font-extrabold text-white text-center tracking-[-2.00px] leading-[60px] [font-family:'Plus_Jakarta_Sans',Helvetica]"
            >
              Ready to Plan Your Next Trip?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: false, amount: 0.5 }}
              className="text-base font-light text-white text-center leading-6 [font-family:'Plus_Jakarta_Sans',Helvetica]"
            >
              Let our AI travel agent chatbot handle the details. From weekend
              getaways to booking flights and hotels, we've got you covered.
              Plus, we'll remember your preferences for future adventures.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
              viewport={{ once: false, amount: 0.5 }}
            >
              <Button className="mt-8 h-12 px-5 py-0 rounded-3xl bg-[#dbe8f2] text-[#111416] hover:bg-[#c5d6e5] font-bold text-base [font-family:'Plus_Jakarta_Sans',Helvetica]">
                Start Planning
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};