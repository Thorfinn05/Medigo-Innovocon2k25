import type { Metadata } from "next";
import "../globals.css";
import {ClerkProvider} from '@clerk/nextjs'
import Header from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import SearchPage from "./search/page";

export const metadata: Metadata = {
  title: "Medigo",
  description: "Medicine at your Doorstep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body>
          <main>
            <Header/>
            {children}
            <SearchPage searchParams={{query: "query"}}/>
          </main>
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
