import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer/Footer";
import NavBar from "./components/nav/NavBar";
import CartProvider from "@/providers/CartProviders";
import { Toaster } from "react-hot-toast";
import getCurrentUser from "@/actions/getCurrentUser";
import { Suspense } from "react";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "E-Commerce App",
  description: "E-Commerce App ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  // console.log("user<<<", currentUser);

  return (
    <html lang="en">
      <body className={"${poppins.className} text-slate-700"}>
        {/* App de useSearchParams() hook u kullandığım için uygulamanın prerender hatası veriyordu. Bu yüzden suspense bileşeninin burada kullanarak hatayı giderdim. */}
        <Suspense>
          <Toaster
            toastOptions={{
              style: {
                background: "rgb(51 65 85)",
                color: "#fff",
              },
            }}
          />
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <NavBar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </Suspense>
      </body>
    </html>
  );
}
