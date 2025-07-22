import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contato - Fale Conosco | PlayCode Agency - Orçamento Grátis Desenvolvimento Web",
  description: "Entre em contato com a PlayCode Agency para seu projeto de desenvolvimento web. Orçamento gratuito, resposta em 2h, suporte 24/7. WhatsApp (11) 95653-4963 ou contato@playcodeagency.xyz. Transforme sua ideia em realidade digital.",
  keywords: [
    "contato desenvolvimento web", "orçamento site profissional", "solicitar orçamento desenvolvimento",
    "whatsapp desenvolvimento web", "email contato agência", "telefone desenvolvimento",
    "orçamento gratuito site", "consultoria desenvolvimento web", "atendimento 24 horas",
    "resposta rápida desenvolvimento", "contato agência digital", "falar com especialista web"
  ],
  openGraph: {
    title: "Contato PlayCode Agency - Orçamento Gratuito e Resposta em 2h",
    description: "Solicite orçamento gratuito para seu projeto. Resposta garantida em 2h, atendimento 24/7, WhatsApp (11) 95653-4963. Vamos transformar sua ideia em realidade digital.",
    url: "https://playcodeagency.xyz/contato",
  },
  alternates: {
    canonical: "https://playcodeagency.xyz/contato",
  },
};

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}