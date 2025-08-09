import Booking from "@/models/Booking";

export const checkAvailability = async (carId: string, pickupDate: string, returnDate: string) => {
  const bookings = await Booking.find({
    car: carId,
    $or: [
      { pickupDate: { $lt: new Date(returnDate) }, returnDate: { $gt: new Date(pickupDate) } }
    ]
  });

  return bookings.length === 0;
};
