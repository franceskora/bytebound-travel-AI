// src/components/Contact.tsx

import { motion } from "framer-motion";
import { Loader2, Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

export const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log("Form submitted:", formData);
    // Add your actual form submission logic here (e.g., using fetch or a library like react-hook-form)

    setIsSubmitting(false);
    setFormData({ name: "", email: "", message: "" }); // Reset form
    // You might want to show a success message here
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      details: "contact@travelai.com",
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      details: "+1 (555) 000-0000",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Live Chat",
      details: "Available 24/7",
    },
  ];

  return (
    <section id="contact" className="w-full py-16 md:py-24 lg:py-32 bg-white dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="flex flex-col items-center space-y-4 text-center mb-12"
        >
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            Contact Us
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-white">
            Get in Touch
          </h2>
          <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-slate-300">
            Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left Column: Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="flex flex-col gap-6"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.5 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700 transition-all hover:shadow-lg hover:dark:border-primary/50"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  {method.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{method.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300">{method.details}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: false, amount: 0.3 }}
            className="flex flex-col gap-6 p-8 rounded-xl shadow-lg bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700"
          >
            <Input
              name="name"
              placeholder="Your name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-12 bg-transparent dark:bg-slate-900/50 focus-visible:ring-offset-slate-900"
            />
            <Input
              name="email"
              placeholder="Your email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-12 bg-transparent dark:bg-slate-900/50 focus-visible:ring-offset-slate-900"
            />
            <Textarea
              name="message"
              placeholder="Your message"
              required
              value={formData.message}
              onChange={handleChange}
              disabled={isSubmitting}
              className="min-h-[150px] bg-transparent dark:bg-slate-900/50 focus-visible:ring-offset-slate-900"
            />
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};