import type { Metadata, Viewport } from "next";
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
  title: {
    default: "PlayCode Agency - Desenvolvimento Web e IA | Criação de Sites Profissionais",
    template: "%s | PlayCode Agency"
  },
  description: "Sua ideia é nosso cheat code para o sucesso! Transforme seu negócio com desenvolvimento web profissional, integração de IA e soluções digitais personalizadas. 10 anos de experiência, 50+ projetos entregues e 40+ clientes satisfeitos.",
  keywords: [
    "desenvolvimento web", "criação de sites", "programação", "desenvolvimento de aplicativos",
    "inteligência artificial", "IA", "chatbot", "automação", "web design responsivo",
    "e-commerce", "sistema web", "landing page", "site profissional", "tecnologia",
    "React", "Next.js", "TypeScript", "Node.js", "desenvolvimento frontend", "backend",
    "São Paulo", "Brasil", "agência digital", "consultoria tecnológica",
    "otimização SEO", "performance web", "experiência do usuário", "UX/UI"
  ],
  authors: [{ name: "PlayCode Agency", url: "https://playcodeagency.xyz" }],
  creator: "PlayCode Agency",
  publisher: "PlayCode Agency",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://playcodeagency.xyz",
    title: "PlayCode Agency - Desenvolvimento Web Profissional e Inteligência Artificial",
    description: "Sua ideia é nosso cheat code para o sucesso! Criamos soluções web inovadoras com IA, desenvolvimento profissional de sites, apps e sistemas que transformam negócios. 10 anos de experiência com resultados comprovados.",
    siteName: "PlayCode Agency",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PlayCode Agency - Desenvolvimento Web e IA Profissional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayCode Agency - Desenvolvimento Web e IA",
    description: "Sua ideia é nosso cheat code para o sucesso! Transformamos ideias em soluções digitais com desenvolvimento profissional, IA e tecnologias avançadas.",
    images: ["/twitter-image.jpg"],
    creator: "@playcodeagency",
  },
  verification: {
    google: "sua-chave-google-search-console",
  },
  alternates: {
    canonical: "https://playcodeagency.xyz",
    languages: {
      'pt-BR': "https://playcodeagency.xyz",
    },
  },
  category: "technology",
  classification: "Desenvolvimento Web, Inteligência Artificial, Consultoria Tecnológica",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" itemScope itemType="https://schema.org/Organization">
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
