import HeroSection from '@/components/sections/HeroSection'
import PowerUpsSection from '@/components/sections/PowerUpsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Início - Desenvolvimento Web Profissional e Inteligência Artificial",
  description: "PlayCode Agency: Especialistas em desenvolvimento web, criação de sites profissionais, integração de IA e soluções digitais personalizadas. 10 anos de experiência, 50+ projetos e 40+ clientes satisfeitos.",
  keywords: [
    "desenvolvimento web profissional", "criação de sites", "agência digital", 
    "inteligência artificial", "chatbot IA", "automação", "landing page",
    "site responsivo", "desenvolvimento React", "Next.js", "TypeScript",
    "otimização performance", "SEO técnico", "experiência usuário"
  ],
  openGraph: {
    title: "PlayCode Agency - Desenvolvimento Web e IA que Transforma Negócios",
    description: "Criamos soluções web inovadoras: sites profissionais, apps inteligentes e sistemas com IA. 10 anos de experiência, 50+ projetos, 40+ clientes satisfeitos.",
    url: "https://playcodeagency.xyz",
  },
  alternates: {
    canonical: "https://playcodeagency.xyz",
  },
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PlayCode Agency",
            "description": "Agência especializada em desenvolvimento web profissional, criação de sites, apps e integração de inteligência artificial",
            "url": "https://playcodeagency.xyz",
            "logo": "https://playcodeagency.xyz/logo.png",
            "foundingDate": "2014",
            "founder": {
              "@type": "Person",
              "name": "Equipe PlayCode Agency"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+55-11-95653-4963",
              "contactType": "Atendimento ao Cliente",
              "availableLanguage": "Portuguese",
              "areaServed": "BR"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "São Bernardo do Campo",
              "addressRegion": "SP",
              "addressCountry": "BR"
            },
            "sameAs": [
              "https://github.com/playcodeagency",
              "https://linkedin.com/company/playcodeagency"
            ],
            "service": [
              {
                "@type": "Service",
                "name": "Desenvolvimento Web",
                "description": "Criação de sites profissionais, aplicações web responsivas e sistemas personalizados"
              },
              {
                "@type": "Service", 
                "name": "Integração de IA",
                "description": "Chatbots inteligentes, automação de processos e soluções com inteligência artificial"
              },
              {
                "@type": "Service",
                "name": "Desenvolvimento Mobile",
                "description": "Aplicações móveis nativas e híbridas para iOS e Android"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "40",
              "bestRating": "5"
            }
          })
        }}
      />
      <HeroSection />
      <PowerUpsSection />
    </main>
  )
}
