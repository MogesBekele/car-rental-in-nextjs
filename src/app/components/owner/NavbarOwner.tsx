"use client";
import Link from "next/link";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/appContext";
import Image from "next/image";

const NavbarOwner = () => {
  const { user } = useAppContext();
  return (
    <div className="flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all">
      <Link href="/" className="flex items-center gap-2">
        <Image
          width={200}
          height={200}
          src={assets.logo}
          alt=""
          className="h-7"
        />
      </Link>
      <p>Welcome, {user?.name ? user.name : "Owner"}</p>
    </div>
  );
};

export default NavbarOwner;
