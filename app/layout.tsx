import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "FreshFold · Laundry pickup in Yaba",
    template: "%s · FreshFold",
  },
  description: "Every item counted, from pickup to your door.",
  openGraph: {
    title: "FreshFold · Laundry pickup in Yaba",
    description: "Every item counted, from pickup to your door.",
    type: "website",
    siteName: "FreshFold",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
  },
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
