import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Title from "@/app/components/Title";
import CarCard from "@/app/components/CarCard";
import { useAppContext } from "@/context/appContext";
import { motion } from "motion/react";
import Image from "next/image";

const FeatureSection = () => {
  const { cars } = useAppContext();
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      viewport={{ once: true }}
      className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Title
          title="Features Vehicles"
          subTitle="Explore our selection of premium vehicles available for your next adventure "
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-18 "
      >
        {cars.slice(0, 6).map((car) => (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            key={car._id}
          >
            <CarCard car={car} />
          </motion.div>
        ))}
      </motion.div>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onClick={() => {
          router.push("/cars");
          scrollTo(0, 0);
        }}
        className="flex items-center justify-center gap-2 mt-18 py-2 px-6 border-borderColor hover:bg-gray-50 rounded-md cursor-pointer"
      >
        Explore all cars{" "}
        <Image width={20} height={20} src={assets.arrow_icon} alt="arrow" />
      </motion.button>
    </motion.div>
  );
};

export default FeatureSection;
