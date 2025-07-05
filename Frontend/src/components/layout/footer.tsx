
import { FacebookIcon,  } from "lucide-react";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";

export const Footer = () => {
  // Footer navigation links
  const footerLinks = [
    { title: "About" },
    { title: "Contact" },
    { title: "Privacy" },
    { title: "Terms" },
  ];

  // Social media icons
  const socialIcons = [
    { icon: <FacebookIcon size={24} /> },
    { icon: <FaXTwitter size={24} /> },
    { icon: <FaInstagram size={24} /> },
  ];

  return (
    <footer className="border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Company Logo/Name */}
          <div className="text-xl font-semibold text-center md:text-left">
            Travel AI
          </div>

          {/* Footer navigation */}
          <nav className="flex justify-center gap-8">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                {link.title}
              </a>
            ))}
          </nav>

          {/* Social media icons */}
          <div className="flex justify-center md:justify-end gap-6">
            {socialIcons.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Travel AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};