import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "TogetherForGood",
  description: "Social Development Events Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body>
        <Navbar />
        {children}
        </body>
    </html>
  );
}
