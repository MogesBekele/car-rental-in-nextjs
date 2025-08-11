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
      name: "ዳንኤል አስፋው",
      location: "አዲስ አበባ, ኢትዮጵያ",
      image: assets.testimonial_image_1,
      testimonail:
        "የተለያዩ ተሽከርካሪዎች ለቅናሽ ማግኘት እና በቀላሉ ኪራይ ማድረግ እዚህ ተቻለ። በእነሱ አገልግሎት ተገናኝቼ ደስ ብሎኛል።",
    },
    {
      name: "ሚስተር አልፋዊ",
      location: "አዲስ አበባ, ኢትዮጵያ",
      image: assets.testimonial_image_2,
      testimonail:
        "እኔ እንደ ባለመኪና በCarRental መኪናዬን ቀላል ሁኔታ አስተዋውቄ ገቢ አገኘሁ። እነሱ የኢንሹራንስ እና የአሽከርካሪ ማረጋገጫ እንዲሁም የደህንነት ክፍያ ሁሉንም በተጠናቀቀ ሁኔታ ያደርጋሉ። እጅግ ተመናቀቁ።",
    },
    {
      name: "ኢብራሂም ወልደማርያም",
      location: "ባህር ዳር, ኢትዮጵያ",
      image: assets.testimonial_image_1,
      testimonail:
        "መኪና ኪራይ ለመውሰድ በእነሱ ላይ እምነት አለኝ። ደንበኞቻቸውን እጅግ ተከትለው በሚሰሩ ናቸው። አገልግሎታቸው እጅግ ተደላይተኛ ነው።.",
    },
  ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
      <Title
        title="የደንበኞቻችን አስተያየት"
        subTitle="ስለ እጅግ ደስ የሚል አገልግሎታችን የሚናገሩትን ደንበኞቻችንን ያገኙ።"
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
