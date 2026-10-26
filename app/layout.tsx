import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "FreshFold Laundry",
  description: "Laundry pickup and delivery in Yaba, Lagos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,400..600;1,400..600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
