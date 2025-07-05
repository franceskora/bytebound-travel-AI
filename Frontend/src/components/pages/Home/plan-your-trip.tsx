import { motion } from "framer-motion";
import { Card, CardContent } from "../../ui/card";

export const PlanYourTrip = () => {
  const tripPlanningSteps = [
    {
      image: "/plan/1.png",
      title: "Tell us where you want to go",
      description: "Tell us your destination, dates, and preferences.",
    },
    {
      image: "/plan/2.png",
      title: "We'll plan your trip",
      description:
        "We'll find the best flights, hotels, and activities for you.",
    },
    {
      image: "/plan/3.png",
      title: "Enjoy your trip",
      description:
        "We'll send you all the details, and you can enjoy your trip.",
    },
  ];

  return (
    <section className="flex flex-col gap-10 px-4 py-10 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="flex flex-col gap-4 w-full max-w-[720px]"
      >
        <h2 className="font-['Plus_Jakarta_Sans',Helvetica] font-extrabold text-2xl sm:text-3xl tracking-[-1.00px] leading-[45px]">
          Plan your next trip with AI
        </h2>
        <p className="font-['Plus_Jakarta_Sans',Helvetica] font-normal text-base leading-6">
          Tell us where you want to go, and we'll handle the rest.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {tripPlanningSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              delay: index * 0.2, // stagger effect
            }}
            viewport={{ once: false, amount: 0.3 }}
            className="flex"
          >
            <Card className="flex flex-col w-full border-none shadow-none">
              <CardContent className="flex flex-col items-start gap-3 p-0 pb-3">
                <div
                  className="w-full h-[169px] rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${step.image})` }}
                />
                <div className="flex flex-col items-start w-full">
                  <h3 className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-base leading-6">
                    {step.title}
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans',Helvetica] font-normal text-sm leading-[21px]">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};