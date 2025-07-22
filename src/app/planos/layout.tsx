import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Planos e Preços - Desenvolvimento Web Profissional a partir de R$ 797",
  description: "Descubra nossos planos de desenvolvimento web: Starter Pack R$ 797, Business One R$ 1.497, Pro Guild R$ 2.497. Sites profissionais, IA, apps e soluções personalizadas com suporte 24/7 e garantia de resultados.",
  keywords: [
    "planos desenvolvimento web", "preços sites profissionais", "orçamento desenvolvimento",
    "pacotes criação sites", "valores desenvolvimento web", "planos mensais desenvolvimento",
    "starter pack desenvolvimento", "business one plano", "pro guild plano",
    "desenvolvimento web barato", "site profissional preço", "orçamento landing page",
    "planos com IA integrada", "desenvolvimento com suporte", "garantia desenvolvimento web"
  ],
  openGraph: {
    title: "Planos de Desenvolvimento Web - Preços a partir de R$ 797 | PlayCode Agency",
    description: "Escolha seu plano ideal: Starter R$ 797, Business R$ 1.497, Pro R$ 2.497. Desenvolvimento profissional com 10 anos de experiência, IA integrada e suporte 24/7.",
    url: "https://playcodeagency.xyz/planos",
  },
  alternates: {
    canonical: "https://playcodeagency.xyz/planos",
  },
};

export default function PlanosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}