import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

export const Pricing = () => {
  const pricingPlans = [
    {
      title: "Basic",
      price: "$9.99",
      buttonText: "Choose Basic",
      features: [
        "Access to basic travel planning",
        "Limited destination suggestions",
        "Standard customer support",
      ],
    },
    {
      title: "Premium",
      price: "$19.99",
      buttonText: "Choose Premium",
      features: [
        "Unlimited travel planning",
        "Personalized destination suggestions",
        "Priority customer support",
        "Exclusive travel deals",
      ],
    },
    {
      title: "Ultimate",
      price: "$29.99",
      buttonText: "Choose Ultimate",
      features: [
        "All Premium features",
        "Dedicated travel consultant",
        "24/7 customer support",
        "Early access to new features",
      ],
    },
  ];

  return (
    <section className="w-full">
      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-[960px] px-4 py-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="flex flex-col items-center"
          >
            <h2 className="font-bold text-[28px] text-center leading-[35px] py-5">
              Choose the Perfect Plan for Your Travel Needs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full py-3">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
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
                >
                  <Card className="rounded-xl h-full">
                    <CardHeader className="p-6 pb-0">
                      <CardTitle className="text-base font-bold ">
                        {plan.title}
                      </CardTitle>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-black text-4xl tracking-[-1px] leading-[45px]">
                          {plan.price}
                        </span>
                        <span className="font-bold text-base ">
                          /month
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-4">
                      <Button
                        variant="secondary"
                        className="w-full h-10 font-bold text-sm rounded-[20px]"
                      >
                        {plan.buttonText}
                      </Button>

                      <div className="flex flex-col gap-2 mt-4">
                        {plan.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-start gap-3"
                          >
                            <div className="w-5 h-5 flex-shrink-0">
                              <CheckIcon className="w-5 h-5" />
                            </div>
                            <span className="text-[13px] leading-5">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};