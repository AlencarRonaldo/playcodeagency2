import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sobre Nós - PlayCode Agency: 10+ Anos Transformando Negócios com Tecnologia",
  description: "Conheça a PlayCode Agency: agência especializada em desenvolvimento web desde 2014. Nossa equipe de especialistas atendeu 40+ clientes satisfeitos em 50+ projetos. Da infraestrutura de TI à IA avançada, somos especialistas em soluções digitais personalizadas.",
  keywords: [
    "sobre playcode agency", "história empresa desenvolvimento", "equipe desenvolvimento web",
    "agência tecnologia São Paulo", "especialistas desenvolvimento", "equipe IA desenvolvimento",
    "empresa desenvolvimento desde 2014", "experiência desenvolvimento web", "valores empresa tecnologia",
    "missão desenvolvimento web", "visão tecnológica", "cultura empresa desenvolvimento"
  ],
  openGraph: {
    title: "Sobre a PlayCode Agency - 10+ Anos Criando Soluções Digitais Inovadoras",
    description: "Desde 2014 transformando negócios com tecnologia. 50+ projetos, 40+ clientes satisfeitos, equipe especializada. Conheça nossa jornada de inovação e excelência.",
    url: "https://playcodeagency.xyz/sobre",
  },
  alternates: {
    canonical: "https://playcodeagency.xyz/sobre",
  },
};

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}