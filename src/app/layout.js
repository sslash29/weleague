import "./globals.css";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import { GlobalProvider, useGlobal } from "@/context/globalContext";
import Notifcation from "@/components/Notifcation";

// Configure Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
});

// Configure InstrumentSans variable fonts (normal and italic)
const instrumentSans = localFont({
  src: [
    {
      path: "../../public/fonts/InstrumentSans-VariableFont_wdth,wght.ttf",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../../public/fonts/InstrumentSans-Italic-VariableFont_wdth,wght.ttf",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-instrument-sans",
});

// Configure Sharpie fonts
const sharpie = localFont({
  src: [
    {
      path: "../../public/fonts/Sharpie-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sharpie-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sharpie-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sharpie-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sharpie-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-sharpie",
});

export const metadata = {
  title: "We Leauge",
  description: "Created By A team in We School madinat nasr",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        className={`${poppins.variable} ${instrumentSans.variable} ${sharpie.variable} flex flex-col p-6 px-12 overflow-x-hidden`}
      >
        <Navbar />
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
