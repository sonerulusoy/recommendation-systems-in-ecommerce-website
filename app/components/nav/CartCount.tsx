"use client";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { PiShoppingCartSimpleLight } from "react-icons/pi";

const CartCount = () => {
  const { cartTotalQty } = useCart();
  const router = useRouter();
  return (
    <div
      className="relative cursor-pointer"
      onClick={() => router.push("/cart")}
    >
      <div>
        <PiShoppingCartSimpleLight className="h-5 w-5" />
      </div>
      <span
        className="
      absolute
      top-[-10px]
      right-[-10px]
      bg-slate-700
      text-white
      h-4
      w-4
      rounded-full
      flex
      items-center
      justify-center
      text-xs
      "
      >
        {cartTotalQty}
      </span>
    </div>
  );
};

export default CartCount;
