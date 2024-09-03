import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  children: React.ReactNode; // Props tipi için düzeltme
}

export const CartContextProvider = ({ children }: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  // Cart items and payment intent load from local storage on initial render
  useEffect(() => {
    const cartItems = localStorage.getItem("ECommerceCartItems");
    if (cartItems) {
      const cProducts: CartProductType[] = JSON.parse(cartItems);
      setCartProducts(cProducts);
    }

    const eCommercePaymentIntent = localStorage.getItem(
      "ECommercePaymentIntent"
    );
    if (eCommercePaymentIntent) {
      setPaymentIntent(JSON.parse(eCommercePaymentIntent)); // paymentIntent parsing fix
    }
  }, []);

  // Update cart totals whenever cartProducts changes
  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;
            acc.total += itemTotal;
            acc.qty += item.quantity;
            return acc;
          },
          {
            total: 0,
            qty: 0,
          }
        );
        setCartTotalQty(qty);
        setCartTotalAmount(total);
      } else {
        setCartTotalQty(0); // Reset values if cart is empty
        setCartTotalAmount(0);
      }
    };
    getTotals();
  }, [cartProducts]);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updateCart: CartProductType[];

      if (prev) {
        const existingProductIndex = prev.findIndex(
          (item) => item.id === product.id
        );
        if (existingProductIndex > -1) {
          const updatedProduct = {
            ...prev[existingProductIndex],
            quantity: prev[existingProductIndex].quantity + product.quantity,
          };
          updateCart = [
            ...prev.slice(0, existingProductIndex),
            updatedProduct,
            ...prev.slice(existingProductIndex + 1),
          ];
        } else {
          updateCart = [...prev, product];
        }
      } else {
        updateCart = [product];
      }

      toast.success("Product added to cart!");

      localStorage.setItem("ECommerceCartItems", JSON.stringify(updateCart));
      return updateCart;
    });
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter(
          (item) => item.id !== product.id
        );
        setCartProducts(filteredProducts);
        toast.success("Product removed");
        localStorage.setItem(
          "ECommerceCartItems",
          JSON.stringify(filteredProducts)
        );
      }
    },
    [cartProducts]
  );

  const handleCartQtyIncrease = useCallback(
    (product: CartProductType) => {
      if (product.quantity === 99) {
        return toast.error("Max quantity reached");
      }

      if (cartProducts) {
        const updatedCart = cartProducts.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        setCartProducts(updatedCart);
        localStorage.setItem("ECommerceCartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  const handleCartQtyDecrease = useCallback(
    (product: CartProductType) => {
      if (product.quantity === 1) {
        return toast.error("Min quantity reached");
      }

      if (cartProducts) {
        const updatedCart = cartProducts.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );

        setCartProducts(updatedCart);
        localStorage.setItem("ECommerceCartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    setCartTotalAmount(0);
    localStorage.setItem("ECommerceCartItems", JSON.stringify(null));
  }, []);

  const handleSetPaymentIntent = useCallback((val: string | null) => {
    setPaymentIntent(val);
    localStorage.setItem("ECommercePaymentIntent", JSON.stringify(val));
  }, []);

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    handleSetPaymentIntent,
    paymentIntent,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
};
