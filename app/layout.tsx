import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Redux from "../components/Redux";
import ClientCookiesProvider from "../components/ClientCookiesProvider";
import Authenticated from "../components/Authenticated";

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
            <nav className="bg-red-50 w-full flex py-4 px-8">Navigation</nav>
            {children}
          </Authenticated>
        </Redux>
      </ClientCookiesProvider>
    </html>
  );
}
