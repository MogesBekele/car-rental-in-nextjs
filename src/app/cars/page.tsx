import { Suspense } from "react";
import Cars from "@/app/cars/cars";

export default function CarsPage() {
  return (
    <Suspense fallback={<div>Loading cars...</div>}>
      <Cars />
    </Suspense>
  );
}
