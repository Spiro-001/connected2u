import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Redux from "../components/Redux";
import ClientCookiesProvider from "../components/ClientCookiesProvider";
import Authenticated from "../components/Authenticated";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Connected2U",
  description: "A photo gallery for your friends and family",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClientCookiesProvider value={cookies().getAll()}>
        <Redux>
          <Authenticated>
            <Nav />
            {children}
          </Authenticated>
        </Redux>
      </ClientCookiesProvider>
    </html>
  );
}
