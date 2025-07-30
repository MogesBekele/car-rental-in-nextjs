import { assets } from "@/assets/assets";
import Title from "@/app/components/Title";
import {motion} from 'motion/react'
import Image from "next/image";

// 1. Define the type
type Testimonial = {
  name: string;
  location: string;
  image: string;
  testimonail: string;
};

const Testimonail = () => {
  // 2. Type the array
  const testimonials: Testimonial[] = [
    {
      name: "Yasin Hassen",
      location: "Addis Ababa, Ethiopia",
      image: assets.testimonial_image_1,
      testimonail:
        "I've had the pleasure of using the services of this company and I can't recommend them enough. They were professional, responsive, and delivered a product that exceeded my expectations.",
    },
    {
      name: "alemayehu",
      location: "Addis Ababa, Ethiopia",
      image: assets.testimonial_image_2,
      testimonail:
        "I've had the pleasure of using the services of this company and I can't recommend them enough. They were professional, responsive, and delivered a product that exceeded my expectations.",
    },
    {
      name: "Minase",
      location: "Addis Ababa, Ethiopia",
      image: assets.testimonial_image_1,
      testimonail:
        "I've had the pleasure of using the services of this company and I can't recommend them enough. They were professional, responsive, and delivered a product that exceeded my expectations.",
    },
  ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
      <Title
        title="What Our Customers Say"
        subTitle="Discover what our satisfied customers have to say about our exceptional service."
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.3 }}
      
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:translate-y-1 duration-300"
          >
            <div className="flex items-center gap-3">
              <Image
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <Image width={16} height={16} key={idx} src={assets.star_icon} alt="star-icon" />
                ))}
            </div>
            <p className="text-gray-500 max-w-90 mt-4">
              {testimonial.testimonail}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Testimonail;
