import clsx from "clsx";
import { Inter } from "next/font/google";
import "./globals.css";

import { SiteMeta } from "@/util/metadata.js";
import "./code-theme.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: SiteMeta.title,
  description: "A test of some documentation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className="h-full scroll-pt-20 scroll-smooth bg-white">
      <head>
        <link
          rel="icon"
          href={`${SiteMeta.basePath}/icon-32.png`}
          sizes="32x32"
        />
        <link
          rel="icon"
          href={`${SiteMeta.basePath}/icon-128.png`}
          sizes="128x128"
        />
        <link
          rel="icon"
          href={`${SiteMeta.basePath}/icon-256.png`}
          sizes="256x256"
        />
      </head>
      <body className={clsx("h-full", inter.className)}>{children}</body>
    </html>
  );
}
