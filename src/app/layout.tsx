import type { Metadata } from "next";
import { Amiko, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const amiko = Amiko({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-amiko",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Início • FAO CLÁSSICOS | Veículos Clássicos & Colecionáveis",
  description: "FAO CLÁSSICOS - Excelência, tradição e curadoria exclusiva em veículos clássicos, esportivos históricos e carros de coleção.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${amiko.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var params = new URLSearchParams(window.location.search);
                var forceIntro = params.get('intro') === 'true' || params.get('intro') === '1';
                var seen = localStorage.getItem('fao_intro_seen') || sessionStorage.getItem('fao_intro_seen');
                if (seen && !forceIntro) {
                  document.documentElement.classList.add('intro-seen');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-white text-neutral-900 font-sans selection:bg-[#a11a1a] selection:text-white">
        {children}
      </body>
    </html>
  );
}
