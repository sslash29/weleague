import "./globals.css";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";

// Configure Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
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
        className={`${poppins.variable} ${sharpie.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
