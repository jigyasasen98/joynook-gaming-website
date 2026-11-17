import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Contact Us & Game Suggestions - JoyNook",
  description:
    "Have a suggestion for a new relaxing browser game or fidget toy? Found a bug? Contact the JoyNook team.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
  openGraph: {
    title: "Contact Us | JoyNook",
    description: "Get in touch with JoyNook for game suggestions and feedback.",
    url: `${SITE_CONFIG.url}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
