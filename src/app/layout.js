import "./globals.css";

export const metadata = {
  title: "We Leauge",
  description: "Created By A team in We School madinat nasr",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
