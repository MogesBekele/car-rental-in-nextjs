"use client";

import { useParams, useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import { useEffect, useState } from "react";
import type { Car } from "@/app/components/DataType/dataType";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import Image from "next/image";
import Loading from "@/app/components/Loading";
import { motion } from "framer-motion";

const CarDetails = () => {
  const params = useParams();
  const id = params?.id as string;

  const {
    cars,
    axios,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    currency,
  } = useAppContext();

  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);

  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/bookings/create", {
        car: id,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        toast.success(data.message);
        router.push("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to book the car. Please try again later.");
      console.error("Booking error:", error);
    }
  };

  useEffect(() => {
    const foundCar = cars.find((car: Car) => car._id === id);

    setCar(foundCar ?? null);
    setLoading(false);
  }, [id, cars]);

  if (loading || !car) return <Loading />;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
        onClick={() => router.back()}
      >
        <Image
          src={assets.arrow_icon}
          alt="Back"
          className="rotate-180 opacity-65"
          width={16}
          height={16}
        />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={car.image}
            alt={car.name}
            width={800}
            height={600}
            className="w-full h-auto rounded-xl shadow-lg object-cover"
          />
        </motion.div>

        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-semibold">{car.name}</h1>
          <p className="text-gray-600 leading-relaxed">{car.description}</p>

          <div className="flex gap-8 text-sm text-gray-700">
            <span>
              <strong>Type:</strong> {car.type}
            </span>
            <span>
              <strong>Seats:</strong> {car.seats}
            </span>
            <span>
              <strong>Gear:</strong> {car.gearType}
            </span>
            <span>
              <strong>Fuel:</strong> {car.fuelType}
            </span>
          </div>

          <p className="text-2xl font-bold text-primary">
            {currency} {car.pricePerDay}/day
          </p>

          <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="pickupDate">Pickup Date:</label>
              <input
                type="date"
                id="pickupDate"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
                className="border px-3 py-2 rounded"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="returnDate">Return Date:</label>
              <input
                type="date"
                id="returnDate"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
                className="border px-3 py-2 rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CarDetails;
