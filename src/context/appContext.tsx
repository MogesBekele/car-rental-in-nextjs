"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { Car } from "@/app/components/DataType/dataType";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "owner";
  image?: string;
}

interface AppContextType {
  currency: string;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isOwner: boolean;
  setIsOwner: React.Dispatch<React.SetStateAction<boolean>>;
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  pickupDate: string;
  setPickupDate: React.Dispatch<React.SetStateAction<string>>;
  returnDate: string;
  setReturnDate: React.Dispatch<React.SetStateAction<string>>;
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
  fetchCars: () => Promise<void>;
  logout: () => void;
  axios: typeof axios;
  fetchUser: () => Promise<void>;
}

interface AppProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: AppProviderProps) => {
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState<Car[]>([]);

  // ✅ Set baseURL only once
  if (!axios.defaults.baseURL) {
    axios.defaults.baseURL =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  }

  // ✅ Fetch user data
  const fetchUser = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

  // ✅ Fetch cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) {
        setCars(data.cars);
      }
    } catch (error) {
      console.error("Failed to fetch cars:", error);
      toast.error("Failed to fetch cars");
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully");
  };

  // ✅ Load token from localStorage once
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // ✅ When token is set, configure axios and fetch user & cars
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
      fetchCars();
    }
  }, [token]);

  const contextValue: AppContextType = {
    currency,
    token,
    setToken,
    user,
    setUser,
    isOwner,
    setIsOwner,
    showLogin,
    setShowLogin,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    cars,
    setCars,
    fetchCars,
    logout,
    axios,
    fetchUser,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
