import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";

export const Hero = () => {
  return (
    <section className="w-full">
      <div className="p-4">
        <Card className="w-full overflow-hidden rounded-xl border-0">
          <CardContent className="p-0">
            {/* Animate the background image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.5 }}
              className="
                flex flex-col items-center justify-center 
                h-[480px] text-center relative 
                bg-[url('/hero-img.png')] 
                bg-cover bg-center 
                before:absolute before:inset-0 
                before:bg-gradient-to-r before:from-black/10 before:to-black/40
              "
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                viewport={{ once: false, amount: 0.5 }}
                className="relative z-10 flex flex-col items-center max-w-[858px] space-y-6 text-light"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  viewport={{ once: false, amount: 0.5 }}
                  className="font-['Plus_Jakarta_Sans',Helvetica] font-extrabold text-5xl tracking-[-2.00px] leading-[60px]"
                >
                  Your personal travel assistant
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  viewport={{ once: false, amount: 0.5 }}
                  className="font-['Plus_Jakarta_Sans',Helvetica] font-normal text-base leading-6 max-w-[638px]"
                >
                  Plan your next trip with AI. Tell us where you want to go,
                  and we'll handle the rest.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  viewport={{ once: false, amount: 0.5 }}
                >
                  <Button className="mt-4 bg-green hover:bg-green/90 rounded-3xl font-['Plus_Jakarta_Sans',Helvetica] font-bold text-white">
                    Get started
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};