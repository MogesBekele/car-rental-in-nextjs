"use client";
import { useEffect, useState } from "react";
import type { Booking } from "@/app/components/DataType/dataType";
import Title from "@/app/components/owner/Title";
import { useAppContext } from "@/context/appContext";
import toast from "react-hot-toast";
import Image from "next/image";

const ManageBookings = () => {
  const { axios, currency } = useAppContext();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchOwnerBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in");
        return;
      }

      console.log("fetching owner bookings with token:", token);
      const { data } = await axios.get("/api/owner/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      data.success ? setBookings(data.bookings) : toast.error(data.message);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    }
  };

  const changeBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in");
        return;
      }

      const { data } = await axios.post(
        "/api/bookings/change-status",
        { bookingId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings(); // Refresh bookings
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to change booking status");
      console.error("Error changing booking status:", error);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests and manage booking status"
      />
      <div className="max-w-3xl w-ful rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={index}
                className="border-t border-borderColor text-gray-500"
              >
                <td className="p-3 flex items-center gap-3">
                  <Image
                    width={50}
                    height={50}
                    src={booking.car.image}
                    alt=""
                    className="h-12 w-12 object-cover aspect-square rounded-md"
                  />
                  <p className="font-medium max-md:hidden">
                    {booking.car.brand} {booking.car.model}
                  </p>
                </td>
                <td className="p-3 max-md:hidden">
                  {booking.pickupDate.split("T")[0]} to{" "}
                  {booking.returnDate.split("T")[0]}
                </td>
                <td className="p-3">
                  {currency}
                  {booking.price}
                </td>
                <td className="p-3 max-md:hidden">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    offline
                  </span>
                </td>
                <td className="p-3">
                  {booking.status === "pending" ? (
                    <select
                      onChange={(e) =>
                        changeBookingStatus(booking._id, e.target.value)
                      }
                      value={booking.status}
                      className="px-2 py-1.5 text-gray-500 border border-borderColor rounded-md outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold  ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
