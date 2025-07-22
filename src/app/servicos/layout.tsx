import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Serviços - Desenvolvimento Web Profissional, Apps e Integração de IA",
  description: "Conheça nossos serviços especializados: desenvolvimento web profissional, criação de sites responsivos, apps móveis, integração de IA e chatbots inteligentes. Soluções tecnológicas que transformam negócios com resultados comprovados.",
  keywords: [
    "serviços desenvolvimento web", "criação sites profissionais", "desenvolvimento aplicativos móveis",
    "integração inteligência artificial", "chatbot desenvolvimento", "automação processos",
    "React development", "Next.js", "TypeScript development", "Node.js backend",
    "responsive web design", "mobile app development", "AI integration services",
    "custom web solutions", "e-commerce development", "API development"
  ],
  openGraph: {
    title: "Serviços de Desenvolvimento Web e IA - PlayCode Agency",
    description: "Desenvolvimento web profissional, apps móveis e integração de IA. 50+ projetos entregues, 40+ clientes satisfeitos, suporte 24/7. 10 anos de experiência transformando negócios.",
    url: "https://playcodeagency.xyz/servicos",
  },
  alternates: {
    canonical: "https://playcodeagency.xyz/servicos",
  },
};

export default function ServicosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}