import type { Metadata } from "next";
import { Orbitron, Exo_2, JetBrains_Mono, Rajdhani } from "next/font/google";
import "./globals.css";
import "@/lib/polyfills";
import AchievementProvider from "@/components/gaming/AchievementProvider";
import KonamiEffects from "@/components/gaming/KonamiEffects";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarioAutoPlay from "@/components/audio/MarioAutoPlay";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const exo = Exo_2({
  variable: "--font-exo",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PlayCode Agency - Gaming Digital Solutions",
  description: "Transforme sua visão em realidade digital com soluções gaming inovadoras, IA avançada e tecnologias emergentes.",
  keywords: ["gaming", "desenvolvimento", "IA", "web development", "cyberpunk", "tecnologia"],
  authors: [{ name: "PlayCode Agency" }],
  openGraph: {
    title: "PlayCode Agency - Gaming Digital Solutions",
    description: "Desenvolva aplicações que conquistam o mundo gaming",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${orbitron.variable} ${exo.variable} ${jetbrainsMono.variable} ${rajdhani.variable} antialiased`}
      >
        <AchievementProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
          <MarioAutoPlay />
          <WhatsAppFloat 
            phoneNumber="5511956534963"
            position="bottom-left"
            companyName="PlayCode Agency"
            showTooltip={true}
            message="Olá! Gostaria de saber mais sobre os serviços da PlayCode Agency 🎮"
          />
          <KonamiEffects />
        </AchievementProvider>
      </body>
    </html>
  );
}
