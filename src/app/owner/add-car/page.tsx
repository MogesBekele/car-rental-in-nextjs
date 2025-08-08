"use client";
import { useState } from "react";
import Title from "@/app/components/owner/Title";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import toast from "react-hot-toast";

type CarDetails = {
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  category: string;
  transmission: string;
  fuel_type: string;
  seating_capacity: number;
  location: string;
  description: string;
};

const AddCar = () => {
  const { axios, currency } = useAppContext();
  const [image, setImage] = useState<File | null>(null);
  const [car, setCar] = useState<CarDetails>({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 0,
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) {
      return null;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image!);
      // Append all car details
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setCar({
          brand: "",
          model: "",
          year: 0,
          pricePerDay: 0,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 0,
          location: "",
          description: "",
        });
        toast.success("Car added successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error adding car:", error);
      toast.error("Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1 max-w-xl ">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car booking, including pricing, availability and specifications."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6"
      >
        {/* Image input */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image" className="cursor-pointer">
            <Image
              width={100}
              height={100}
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt="Car upload"
              className="h-14 rounded border border-gray-300"
            />
            <input
              type="file"
              id="car-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              required
            />
          </label>
          <p className="text-sm text-gray-500">Upload car image</p>
        </div>

        {/* Car details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label>Brand</label>
            <input
              type="text"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
              placeholder="Enter car brand"
              className="border border-borderColor rounded-md px-3 py-2 mt-1 outline-none"
              required
            />
          </div>

          <div className="flex flex-col">
            <label>Model</label>
            <input
              type="text"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
              placeholder="Enter car model"
              className="border border-borderColor rounded-md px-3 py-2 mt-1 outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label>Year</label>
            <input
              type="number"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: Number(e.target.value) })}
              placeholder="2025"
              className="border border-borderColor rounded-md px-3 py-2 mt-1 outline-none"
              required
              min={1900}
              max={new Date().getFullYear() + 1}
            />
          </div>

          <div className="flex flex-col">
            <label>Daily Price {currency}</label>
            <input
              type="number"
              value={car.pricePerDay}
              onChange={(e) =>
                setCar({ ...car, pricePerDay: Number(e.target.value) })
              }
              placeholder="200"
              className="border border-borderColor rounded-md px-3 py-2 mt-1 outline-none"
              required
              min={0}
            />
          </div>

          <div className="flex flex-col">
            <label>Category</label>
            <select
              value={car.category}
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              className="border border-borderColor rounded-md px-3 py-2 mt-1 outline-none"
              required
            >
              <option value="">Select Category</option>
              <option value="luxury">Luxury</option>
              <option value="sedan">Sedan</option>
              <option value="SUV">SUV</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label>Transmission</label>
            <select
              value={car.transmission}
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              className="border border-borderColor rounded-md px-3 py-2 mt-1 outline-none"
              required
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Fuel Type</label>
            <select
              value={car.fuel_type}
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              className="border border-borderColor rounded-md px-3 py-2 mt-1 outline-none"
              required
            >
              <option value="">Select Fuel Type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Seating Capacity</label>
            <input
              type="number"
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({ ...car, seating_capacity: Number(e.target.value) })
              }
              placeholder="4"
              className="border border-borderColor rounded-md px-3 py-2 mt-1 outline-none"
              required
              min={1}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label>Location</label>
          <select
            value={car.location}
            onChange={(e) => setCar({ ...car, location: e.target.value })}
            className="border border-borderColor rounded-md px-3 py-2 mt-1 outline-none"
            required
          >
            <option value="">Select a Location</option>
            <option value="Addis Ababa">Addis Ababa</option>
            <option value="Hawassa">Hawassa</option>
            <option value="Adama">Adama</option>
            <option value="Bahrdar">Bahrdar</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label>Description</label>
          <textarea
            rows={5}
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
            placeholder="e.g. luxurious car for rent"
            className="border border-borderColor rounded-md px-3 py-2 mt-1 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className={`flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white w-max rounded-md font-medium cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          <Image width={20} height={20} src={assets.tick_icon} alt="tick" />
          {loading ? "Listing..." : "List Your Car"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
