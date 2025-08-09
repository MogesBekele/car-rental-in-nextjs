"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion"; // ✅ Correct import
import { useAppContext } from "@/context/appContext"; // ✅ Correct import
import { menuLinks } from "@/assets/assets"; // ✅ Absolute import if tsconfig has baseUrl

type MenuLink = {
  name: string;
  path: string;
};

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } =
    useAppContext();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(!isOwner);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Role change failed:", error);
      toast.error("Failed to change role");
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        pathname === "/" ? "bg-light" : "bg-white"
      }`}
    >
      {/* Logo */}
      <Link href="/">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Image
            src="/assets/logo.svg"
            alt="logo"
            width={100}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </motion.div>
      </Link>

      {/* Navigation Links */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
          pathname === "/" ? "bg-light" : "bg-white"
        } ${open ? "max-sm:translate-x-0" : "max-sm:-translate-x-full"}`}
      >
        {menuLinks.map((link: MenuLink, index) => (
          <Link key={index} href={link.path}>
            {link.name}
          </Link>
        ))}

        {/* Search Input */}
        <div className="hidden lg:flex items-center gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            placeholder="Search cars"
            className="py-1.5 w-full bg-transparent outline-none placeholder:text-gray-500"
          />
          <Image
            src="/assets/search_icon.svg"
            alt="search"
            width={20}
            height={20}
          />
        </div>

        {/* Auth Buttons */}
        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          <button
            onClick={() => (isOwner ? router.push("/owner") : changeRole())}
            className="cursor-pointer"
          >
            {isOwner ? "Dashboard" : "List cars"}
          </button>
          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* Hamburger */}
      <button
        className="sm:hidden cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <Image
          src={open ? "/assets/close_icon.svg" : "/assets/menu_icon.svg"}
          alt="menu"
          width={28}
          height={28}
        />
      </button>
    </motion.div>
  );
};

export default Navbar;
