"use client";

import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  inStock: boolean;
}

interface SearchResultsProps {
  products: Product[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ products }) => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams?.get("searchTerm") || "";

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{product.price} $</p>
          </div>
        ))
      ) : (
        <p>No products found for "{searchTerm}"</p>
      )}
    </div>
  );
};

const SearchBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]); // Ürünlerinizi state olarak tutabilirsiniz

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      searchTerm: "",
    },
  });

  useEffect(() => {
    // Örnek ürünleri burada set edebilirsiniz
    setProducts([
      {
        id: "1",
        name: "iPhone 12",
        description: "Apple iPhone 12",
        price: 999,
        brand: "Apple",
        category: "Smartphone",
        inStock: true,
      },
      {
        id: "2",
        name: "Galaxy S21",
        description: "Samsung Galaxy S21",
        price: 799,
        brand: "Samsung",
        category: "Smartphone",
        inStock: true,
      },
      {
        id: "3",
        name: "Pixel 5",
        description: "Google Pixel 5",
        price: 699,
        brand: "Google",
        category: "Smartphone",
        inStock: true,
      },
      // Diğer ürünler...
    ]);
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!data.searchTerm) return router.push("/");

    const url = queryString.stringifyUrl(
      { url: "/", query: { searchTerm: data.searchTerm } },
      { skipNull: true }
    );
    router.push(url);
    reset();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-4">
        <input
          {...register("searchTerm")}
          autoComplete="off"
          type="text"
          placeholder="Search"
          className="p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-[0.5px] focus:border-slate-500 w-80"
        />
        <button
          onClick={handleSubmit(onSubmit)}
          className="bg-slate-700 hover:opacity-80 text-white p-2 rounded-r-md"
        >
          Search
        </button>
      </div>
      <SearchResults products={products} />
    </div>
  );
};

export default SearchBar;
