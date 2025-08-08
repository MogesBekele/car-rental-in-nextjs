"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import type { Car } from "@/app/components/DataType/dataType";
import Title from "@/app/components/owner/Title";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import Image from "next/image";

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState<Car[]>([]);

  const fetchOwerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/get-cars");

      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch cars");
      console.error("Error fetching cars:", error);
    }
  };
  const toggleAvailability = async (carId: string) => {
    try {
      const { data } = await axios.post(`/api/owner/toggle-availability`, {
        carId,
      });
      if (data.success) {
        toast.success(data.message);
        fetchOwerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to toggle car availability");
      console.error("Error toggling car availability:", error);
    }
  };
  const deleteCar = async (carId: string) => {
    try {
      const comfirm = window.confirm(
        "Are you sure you want to delete this car?"
      );
      if (!comfirm) return;
      const { data } = await axios.delete(`/api/owner/delete-car/${carId}`);
      if (data.success) {
        toast.success(data.message);
        fetchOwerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete car");
      console.error("Error deleting car:", error);
    }
  };
  useEffect(() => {
    isOwner && fetchOwerCars();
  }, [isOwner]);
  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="view all listed cars, update their details and remove then from the booking platform"
      />
      <div className="max-w-3xl w-ful rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border border-collapse text-left text-sm text-gray-600 ">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  <Image
                    width={50}
                    height={50}
                    src={car.image}
                    alt=""
                    className="w-12 h-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {car.seating_capacity} . {car.transmission}
                    </p>
                  </div>
                </td>
                <td className="p-3 max-md:hidden">{car.category}</td>
                <td className="p-3">
                  {currency}
                  {car.pricePerDay}/day
                </td>
                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      car.isAvailable
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="p-3 flex items-center">
                  <Image
                    width={50}
                    height={40}
                    onClick={() => toggleAvailability(car._id)}
                    src={
                      car.isAvailable ? assets.eye_close_icon : assets.eye_icon
                    }
                    alt=""
                    className="cursor-pointer"
                  />

                  <Image
                    width={40}
                    height={40}
                    onClick={() => deleteCar(car._id)}
                    src={assets.delete_icon}
                    alt=""
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;
