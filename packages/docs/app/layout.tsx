import { SiteMeta } from "@/util/metadata.js";
import clsx from "clsx";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: SiteMeta.title,
  description: "A test of some documentation",
};

const darkScript = `(function() {
  const dark = localStorage.theme
  ? localStorage.theme === "dark"
  : window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (dark) {
    document.documentElement.classList.add("[&_*]:!transition-none");
    document.documentElement.classList.add("dark")
    window.setTimeout(() => {
      document.documentElement.classList.remove("[&_*]:!transition-none");
    }, 0);
  }
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className="h-full scroll-pt-20 scroll-smooth">
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
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: darkScript }}
        />
      </head>
      <body
        className={clsx(
          "h-full bg-white dark:bg-zinc-900",
          "superdocs dark:superdocs-dark",
          inter.className,
        )}
      >
        {children}
      </body>
    </html>
  );
}
