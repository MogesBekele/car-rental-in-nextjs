"use client";

import { useEffect, ReactNode } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import NavbarOwner from "@/app/components/owner/NavbarOwner";
import Sidebar from "@/app/components/owner/Sidebar";

type OwnerLayoutProps = {
  children: ReactNode;
};

const OwnerLayout = ({ children }: OwnerLayoutProps) => {
  const { isOwner } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isOwner) {
      router.push("/");  // redirect to home if not owner
    }
  }, [isOwner, router]);

  if (!isOwner) return null;  // or loading spinner if you prefer

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarOwner />
      <div className="flex flex-1">
        <aside className="w-52"> {/* fixed width sidebar */}
          <Sidebar />
        </aside>
        <main className="flex-1 p-6 overflow-auto"> {/* flex-grow main */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
