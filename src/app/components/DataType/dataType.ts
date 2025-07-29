export type Car = {
  _id: string;
  owner: string;
  image: string;
  isAvailable: boolean;
  pricePerDay: number;
  brand: string;
  model: string;
  category: string;
  year: number;
  seating_capacity: number;
  fuel_type: string;
  transmission: string;
  location: string;
  description: string;
  createdAt: string;
};

export type Booking = {
  _id: string;
  car: Car;
  user: string;
  owner: string;
  pickupDate: string;
  returnDate: string;
  status: string;
  price: number;
  createdAt: string;
};

export type RecentBooking = {
  car: {
    brand: string;
    model: string;
  };
  createdAt: string;
  price: number;
  status: string;
};
export type DashboardData = {
  totalCars: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  recentBookings: RecentBooking[];
  monthlyRevenue: number;
};