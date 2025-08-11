"use client";
import { assets, cityList } from "@/assets/assets";
import { useState } from "react";
import { useAppContext } from "@/context/appContext";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const router = useRouter();
  const { pickupDate, setPickupDate, returnDate, setReturnDate } =
    useAppContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="pt-24 min-h-screen flex flex-col items-center justify-center gap-14 bg-light text-center"
    >
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-semibold"
      >
      ቆንጆ መኪናዎች ለኪራይ 
      </motion.h1>

      <motion.form
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8">
          <div className="flex flex-col items-start gap-2">
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            >
              <option value="">Pickup Location</option>
              {cityList.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
            <p className="px-1 text-sm text-gray-500">
              {pickupLocation || "please select location"}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-date">Pick-up Date</label>
            <input
              type="date"
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
              className="text-sm text-gray-500"
              required
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <label htmlFor="return-date">Return Date</label>
            <input
              type="date"
              id="return-date"
              className="text-sm text-gray-500"
              required
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!pickupLocation || !pickupDate || !returnDate}
          className="flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer"
        >
          <Image
            src={assets.search_icon}
            width={20}
            height={20}
            alt="search"
            className="brightness-300 w-5 h-5"
          />
          Search
        </motion.button>
      </motion.form>

      <motion.img
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        src={assets.main_car} // Ensure this points to SVG: e.g., /assets/main_car.svg
        alt="car"
        className="max-h-75"
      />
    </motion.div>
  );
};

export default Hero;
