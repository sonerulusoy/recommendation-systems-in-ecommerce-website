"use client";

import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import { Rating } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  data: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter();

  const productRating =
    data.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
    data.reviews.length;

  /*console.log(productRating);*/
  return (
    <div
      onClick={() => router.push(`/product/${data.id}`)}
      className="col-span-1 cursor-pointer border-[1.5px]
    border-slate-300 bg-white rounded-lg p-4 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 text-center text-base"
    >
      <div className="flex flex-col items-center w-full gap-3">
        {/* Resim Bölümü */}
        <div className="aspect-square overflow-hidden relative w-full rounded-lg bg-gray-100">
          <Image
            fill
            src={data.images[0].image}
            alt={data.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        {/* Ürün İsmi */}
        <div className="mt-2 font-semibold text-gray-700 truncate">
          {truncateText(data.name)}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center">
          <Rating value={productRating} readOnly />
          <span className="ml-2 text-sm text-gray-500">
            ({data.reviews.length} reviews)
          </span>
        </div>

        {/* Fiyat */}
        <div className="font-bold text-lg text-indigo-600 mt-1">
          {formatPrice(data.price)}
        </div>

        {/* Satın Al Butonu */}
        <button
          onClick={() => router.push(`/product/${data.id}`)}
          className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition-all duration-300"
        >
          View Product
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
