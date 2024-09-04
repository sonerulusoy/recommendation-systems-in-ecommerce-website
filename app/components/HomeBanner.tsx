"use client";

import Image from "next/image";
import { useState } from "react";

const HomeBanner = () => {
  const [productRecommendations] = useState([
    // Burada önerilen ürünler product card şeklinde gösterilecektir.
  ]);

  return (
    <div className="relative bg-gradient-to-r from-sky-500 to-sky-700 mb-8">
      <div className="mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Recommended for You
        </h2>
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {productRecommendations.map((product) => (
            <div
              key={product.id}
              className="col-span-1 cursor-pointer border-[1.2px]
                border-slate-200 bg-slate-50 rounded-sm p-4 transition hover:scale-105 text-center"
            >
              <div className="flex flex-col items-center w-full gap-4">
                <div className="aspect-square overflow-hidden relative w-full h-48">
                  <Image
                    fill
                    src={product.images[0].image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
                <div className="mt-2 text-base font-semibold">
                  {product.name}
                </div>
                <div className="text-lg font-bold text-indigo-600">
                  ${product.price}
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default HomeBanner;
