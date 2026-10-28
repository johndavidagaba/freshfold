import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule a pickup",
  openGraph: {
    title: "Schedule a pickup · FreshFold",
    description: "Every item counted, from pickup to your door.",
    type: "website",
    siteName: "FreshFold",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Schedule a pickup · FreshFold",
    description: "Every item counted, from pickup to your door.",
  },
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
