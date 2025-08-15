"use client";
import { assets } from "@/assets/assets";
import { motion } from "motion/react";
import Image from "next/image";
const MotionImage = motion(Image);
//const socialLinks = [
//   { href: "#", src: assets.facebook_logo, alt: "facebook" },
//   { href: "#", src: assets.instagram_logo, alt: "instagram" },
//   { href: "#", src: assets.twitter_logo, alt: "twitter" },
//   { href: "#", src: assets.gmail_logo, alt: "email" },
// ];

// // In your JSX:
// <div className="flex items-center gap-3 mt-6">
//   {socialLinks.map((link) => (
//     <a href={link.href} key={link.alt}>
//       <img src={link.src} alt={link.alt} className="w-5 h-5" />
//     </a>
//   ))}
// </div>

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500 "
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-between items-start gap-8 pb-6 border-b border-borderColor"
      >
        <div>
          <MotionImage
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            src={assets.logo}
            width={150}
            height={40}
            alt="logo"
            className=" h-8 md:h-9"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-80 mt-3"
          >
            promise car rental service with a wide selection of luxury and
            everyday vehicles for all your driving neeeds
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mt-6"
          >
            <a href="#">
              <Image
                src={assets.facebook_logo}

                width={20}
                height={20}
                alt="facebook"
                className="w-5 h-5"
              />
            </a>
            <a href="#">
              <Image  width={20}
                height={20} src={assets.instagram_logo} alt="inta" className="w-5 h-5" />
            </a>

            <a href="#">
              <Image  width={20}
                height={20}
                src={assets.twitter_logo}
                alt="twitter"
                className="w-5 h-5"
              />
            </a>
            <a href="#">
              <Image  width={20}
                height={20}  src={assets.gmail_logo} alt="email" className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        
        
        className="flex flex-wrap justify-between w-1/2 gap-8">
          <div>
            <h2 className="text-base text-gray-800 font-medium uppercase">
              Quick Links
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Browse Cars</a>
              </li>
              <li>
                <a href="#">List Your Car</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base text-gray-800 font-medium uppercase">
              Resources
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Terms of Services</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Insurance</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-base text-gray-800 font-medium uppercase">
              Contact
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              <li>megenagna street, Addis Ababa</li>
              <li>Addis Ababa, Ethiopia</li>
              <li>+251 92929292</li>
              <li>carrental@gmail.com</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
      className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Cookies</a>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Footer;
