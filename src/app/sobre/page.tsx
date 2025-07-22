'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  Users, 
  Target, 
  Shield, 
  Trophy, 
  Code,
  Brain,
  Rocket,
  Heart,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react'
import { useAudio, audioHelpers } from '@/lib/hooks/useAudio'
import { trackingHelpers } from '@/lib/hooks/useAchievements'

interface TeamMember {
  id: string
  name: string
  role: string
  specialization: string
  level: number
  avatar: string
  skills: string[]
  achievements: number
  experience: string
  bio: string
  social: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

interface CompanyValue {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'ceo',
    name: 'Alex "CyberCode" Silva',
    role: 'Chief Technology Officer',
    specialization: 'Full-Stack Architect',
    level: 99,
    avatar: '/team/alex.jpg',
    skills: ['React', 'Node.js', 'AI/ML', 'DevOps', 'Architecture'],
    achievements: 47,
    experience: '8+ anos',
    bio: 'Veterano da programação com paixão por transformar código em experiências mágicas. Especialista em soluções escaláveis e arquiteturas de alta performance.',
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: 'lead-dev',
    name: 'Rones Carvalho',
    role: 'Lead Frontend Developer', 
    specialization: 'UI/UX Engineer',
    level: 87,
    avatar: '/team/rones.jpg',
    skills: ['React', 'TypeScript', 'Design Systems', 'Animation', 'Accessibility'],
    achievements: 34,
    experience: '6+ anos',
    bio: 'Designer-developer híbrida que acredita que código bonito deve criar interfaces ainda mais bonitas. Especialista em experiências interativas.',
    social: {
      github: '#',
      linkedin: '#'
    }
  },
  {
    id: 'ai-specialist',
    name: 'Ronaldo Carvalho',
    role: 'AI/ML Specialist',
    specialization: 'Systems Analyst & Developer',
    level: 95,
    avatar: '/team/seya.jpg',
    skills: ['Python', 'C#', 'Claude Code', 'Data Science', 'NLP'],
    achievements: 52,
    experience: '10+ anos',
    bio: 'Especializado em desenvolvimento e análise de sistemas complexos. Como o Cavaleiro de Pegasus, transforma desafios técnicos em soluções elegantes com determinação e código limpo.',
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: 'devops',
    name: 'Sarah "CloudMaster" Rodriguez',
    role: 'DevOps Engineer',
    specialization: 'Infrastructure Architect',
    level: 82,
    avatar: '/team/sarah.jpg',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Monitoring'],
    achievements: 29,
    experience: '5+ anos',
    bio: 'Mestre em arquiteturas cloud que mantém tudo funcionando perfeitamente. Especialista em escalabilidade e resiliência de sistemas.',
    social: {
      github: '#',
      linkedin: '#'
    }
  }
]

const COMPANY_VALUES: CompanyValue[] = [
  {
    id: 'innovation',
    title: 'Inovação Constante',
    description: 'Sempre explorando novas tecnologias e abordagens para criar soluções revolucionárias.',
    icon: Brain,
    color: 'text-neon-cyan'
  },
  {
    id: 'quality',
    title: 'Qualidade Premium',
    description: 'Cada linha de código é escrita com excelência, seguindo as melhores práticas da indústria.',
    icon: Shield,
    color: 'text-laser-green'
  },
  {
    id: 'collaboration',
    title: 'Colaboração Elite',
    description: 'Trabalhamos como uma guild, onde cada membro contribui com suas habilidades únicas.',
    icon: Users,
    color: 'text-gaming-purple'
  },
  {
    id: 'results',
    title: 'Resultados Épicos',
    description: 'Focamos em entregar soluções que realmente transformam negócios e vidas.',
    icon: Trophy,
    color: 'text-plasma-yellow'
  },
  {
    id: 'passion',
    title: 'Paixão Legendary',
    description: 'Amamos o que fazemos e isso se reflete em cada projeto que desenvolvemos.',
    icon: Heart,
    color: 'text-magenta-power'
  },
  {
    id: 'speed',
    title: 'Velocidade Turbo',
    description: 'Entregamos projetos rapidamente sem comprometer a qualidade e atenção aos detalhes.',
    icon: Rocket,
    color: 'text-electric-blue'
  }
]

const COMPANY_STATS = [
  { label: 'Projetos Concluídos', value: '50+', color: 'text-laser-green' },
  { label: 'Clientes Satisfeitos', value: '40+', color: 'text-neon-cyan' },
  { label: 'Linhas de Código', value: '500K+', color: 'text-plasma-yellow' },
  { label: 'Anos de Experiência', value: '10+', color: 'text-magenta-power' },
  { label: 'Tecnologias Dominadas', value: '25+', color: 'text-electric-blue' },
  { label: 'Awards Conquistados', value: '8+', color: 'text-gaming-purple' }
]

export default function SobrePage() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { playContextMusic } = useAudio()

  useEffect(() => {
    setMounted(true)
    
    // Track page view
    trackingHelpers.trackPageView('/sobre')
    
    // Play ambient music
    // Music is now controlled by the MarioAutoPlay component globally
  }, [])

  const handleMemberSelect = (memberId: string) => {
    audioHelpers.playPowerUpSelect()
    trackingHelpers.trackClick(`team_member_${memberId}`)
    setSelectedMember(selectedMember === memberId ? null : memberId)
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gradient-console">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
              "@type": "Organization",
              "name": "PlayCode Agency",
              "foundingDate": "2014",
              "description": "Agência especializada em desenvolvimento web e inteligência artificial",
              "employee": [
                {
                  "@type": "Person",
                  "name": "Ronaldo Carvalho",
                  "jobTitle": "AI/ML Specialist & Systems Analyst",
                  "description": "10+ anos de experiência em desenvolvimento e análise de sistemas"
                },
                {
                  "@type": "Person",
                  "name": "Rones Carvalho",
                  "jobTitle": "Lead Frontend Developer",
                  "description": "6+ anos de experiência em UI/UX e desenvolvimento frontend"
                }
              ],
              "numberOfEmployees": "4-10",
              "award": "15+ prêmios conquistados",
              "foundingLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "São Bernardo do Campo",
                  "addressRegion": "São Paulo",
                  "addressCountry": "BR"
                }
              }
            }
          })
        }}
      />
      {/* Matrix Rain Background */}
      <div className="matrix-rain">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="text-terminal-green opacity-20"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${12 + Math.random() * 6}px`
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </span>
        ))}
      </div>

      {/* Circuit Pattern Overlay */}
      <div className="absolute inset-0 circuit-pattern opacity-10 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Code className="w-8 h-8 text-neon-cyan" />
            <h1 className="gaming-title text-4xl lg:text-6xl font-bold text-neon-cyan neon-glow">
              SOBRE NÓS
            </h1>
            <Code className="w-8 h-8 text-neon-cyan" />
          </div>
          
          <p className="gaming-subtitle text-xl lg:text-2xl text-led-white/80 max-w-4xl mx-auto mb-8">
            Somos uma guild de desenvolvedores elite, unida pela paixão de criar 
            soluções digitais que transformam ideias em realidades extraordinárias.
          </p>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="gaming-card p-8 max-w-4xl mx-auto bg-gradient-to-r from-gaming-purple/20 to-neon-cyan/20 border-2 border-neon-cyan/50"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="w-6 h-6 text-plasma-yellow" />
              <h2 className="gaming-title text-2xl font-bold text-plasma-yellow">
                NOSSA MISSÃO
              </h2>
            </div>
            <p className="gaming-subtitle text-lg text-led-white/90 leading-relaxed">
              Transformar o futuro através da tecnologia, criando soluções inovadoras 
              que empoderam empresas e pessoas a alcançarem seu máximo potencial digital. 
              Cada projeto é uma nova aventura épica em direção ao sucesso.
            </p>
          </motion.div>
        </motion.div>

        {/* Company Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20"
        >
          {COMPANY_STATS.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="gaming-card p-6 text-center border border-neon-cyan/30 hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
            >
              <div className={`gaming-display text-3xl font-bold mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="gaming-mono text-xs text-led-white/60 uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="gaming-title text-3xl lg:text-4xl font-bold text-neon-cyan mb-4 neon-glow">
              NOSSOS VALORES
            </h2>
            <p className="gaming-subtitle text-lg text-led-white/80 max-w-3xl mx-auto">
              Os princípios que nos guiam em cada linha de código e cada decisão estratégica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COMPANY_VALUES.map((value, index) => {
              const ValueIcon = value.icon
              return (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  className="gaming-card p-6 text-center hover:shadow-[0_0_25px_rgba(0,255,255,0.2)]"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neon-cyan/20 to-gaming-purple/20 border border-neon-cyan/50 rounded-xl flex items-center justify-center">
                    <ValueIcon size={32} className={value.color} />
                  </div>
                  <h3 className={`gaming-title text-lg font-bold mb-3 ${value.color}`}>
                    {value.title}
                  </h3>
                  <p className="gaming-subtitle text-sm text-led-white/70">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="gaming-title text-3xl lg:text-4xl font-bold text-neon-cyan mb-4 neon-glow">
              NOSSA GUILD
            </h2>
            <p className="gaming-subtitle text-lg text-led-white/80 max-w-3xl mx-auto">
              Conheça os mestres por trás da magia. Cada membro traz habilidades únicas 
              para criar soluções extraordinárias.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member, index) => {
              const isSelected = selectedMember === member.id
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  className={`
                    gaming-card cursor-pointer relative overflow-hidden
                    border-2 border-gaming-purple/50 hover:border-gaming-purple
                    hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]
                    transition-all duration-300
                    ${isSelected ? 'border-gaming-purple shadow-[0_0_30px_rgba(139,92,246,0.6)] scale-105' : ''}
                  `}
                  onClick={() => handleMemberSelect(member.id)}
                  onMouseEnter={audioHelpers.playHover}
                >
                  {/* Level Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-2 py-1 bg-plasma-yellow text-controller-black rounded-md gaming-mono text-xs font-bold">
                      LV.{member.level}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="p-6 pb-4">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gaming-purple/30 to-neon-cyan/30 border-2 border-gaming-purple/50 rounded-full flex items-center justify-center overflow-hidden">
                      {member.avatar ? (
                        <Image 
                          src={member.avatar} 
                          alt={member.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded-full"
                          onError={() => {
                            console.log('Failed to load avatar for:', member.name);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gaming-purple to-neon-cyan opacity-20 flex items-center justify-center">
                          <Users size={32} className="text-gaming-purple" />
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="text-center mb-4">
                      <h3 className="gaming-title text-lg font-bold text-gaming-purple mb-1">
                        {member.name}
                      </h3>
                      <p className="gaming-mono text-sm text-neon-cyan mb-2">
                        {member.role}
                      </p>
                      <p className="text-xs text-led-white/60">
                        {member.specialization}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-center">
                        <div className="gaming-display text-lg font-bold text-laser-green">
                          {member.achievements}
                        </div>
                        <div className="gaming-mono text-xs text-led-white/60">
                          CONQUISTAS
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="gaming-display text-lg font-bold text-electric-blue">
                          {member.experience}
                        </div>
                        <div className="gaming-mono text-xs text-led-white/60">
                          EXPERIÊNCIA
                        </div>
                      </div>
                    </div>

                    {/* Skills Preview */}
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {member.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gaming-purple/20 border border-gaming-purple/30 rounded text-xs gaming-mono text-gaming-purple"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="px-2 py-1 bg-led-white/10 border border-led-white/20 rounded text-xs gaming-mono text-led-white/60">
                          +{member.skills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Expand Button */}
                    <button className="w-full px-4 py-2 border border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 rounded-md gaming-mono text-xs font-bold transition-all duration-200">
                      {isSelected ? 'FECHAR PERFIL' : 'VER PERFIL COMPLETO'}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gaming-purple/30 p-6 overflow-hidden"
                    >
                      {/* Bio */}
                      <div className="mb-4">
                        <h4 className="gaming-mono text-sm font-bold text-neon-cyan mb-2">
                          📖 BIO:
                        </h4>
                        <p className="text-sm text-led-white/80 leading-relaxed">
                          {member.bio}
                        </p>
                      </div>

                      {/* All Skills */}
                      <div className="mb-4">
                        <h4 className="gaming-mono text-sm font-bold text-electric-blue mb-2">
                          ⚡ HABILIDADES:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-electric-blue/20 border border-electric-blue/30 rounded text-xs gaming-mono text-electric-blue"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Social Links */}
                      <div>
                        <h4 className="gaming-mono text-sm font-bold text-magenta-power mb-2">
                          🌐 SOCIAL:
                        </h4>
                        <div className="flex gap-2">
                          {member.social.github && (
                            <button className="p-2 bg-magenta-power/20 border border-magenta-power/30 rounded text-magenta-power hover:bg-magenta-power/30 transition-colors">
                              <Github size={16} />
                            </button>
                          )}
                          {member.social.linkedin && (
                            <button className="p-2 bg-magenta-power/20 border border-magenta-power/30 rounded text-magenta-power hover:bg-magenta-power/30 transition-colors">
                              <Linkedin size={16} />
                            </button>
                          )}
                          {member.social.twitter && (
                            <button className="p-2 bg-magenta-power/20 border border-magenta-power/30 rounded text-magenta-power hover:bg-magenta-power/30 transition-colors">
                              <Twitter size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Circuit Pattern */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="circuit-pattern opacity-5 w-full h-full" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Journey Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="gaming-title text-3xl lg:text-4xl font-bold text-neon-cyan mb-4 neon-glow">
              NOSSA JORNADA
            </h2>
            <p className="gaming-subtitle text-lg text-led-white/80 max-w-3xl mx-auto">
              A evolução épica da PlayCode Agency através dos anos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                year: '2014',
                title: 'Origem da Guild',
                description: 'Nossa jornada iniciou-se com infraestrutura de TI e suporte técnico. Evoluímos construindo uma base sólida de experiência tecnológica e atendimento ao cliente.',
                icon: Users,
                color: 'text-neon-cyan'
              },
              {
                year: '2019', 
                title: 'Evolução Épica',
                description: 'Transição para desenvolvimento de software e soluções digitais. Formalizamos a empresa expandindo para desenvolvimento web, mobile e automação de processos.',
                icon: Rocket,
                color: 'text-gaming-purple'
              },
              {
                year: '2024',
                title: 'Era da IA',
                description: 'Pioneiros em integração de IA, oferecemos soluções inteligentes que transformam negócios.',
                icon: Brain,
                color: 'text-plasma-yellow'
              }
            ].map((milestone, index) => {
              const MilestoneIcon = milestone.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -8 }}
                  className="gaming-card p-6 text-center border border-neon-cyan/30 hover:border-neon-cyan/60"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neon-cyan/20 to-gaming-purple/20 border border-neon-cyan/50 rounded-xl flex items-center justify-center">
                    <MilestoneIcon size={32} className={milestone.color} />
                  </div>
                  <div className={`gaming-display text-2xl font-bold mb-2 ${milestone.color}`}>
                    {milestone.year}
                  </div>
                  <h3 className="gaming-title text-lg font-bold text-neon-cyan mb-3">
                    {milestone.title}
                  </h3>
                  <p className="gaming-subtitle text-sm text-led-white/70">
                    {milestone.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-center gaming-card p-8 bg-gradient-to-r from-gaming-purple/20 to-neon-cyan/20 border-2 border-neon-cyan/50"
        >
          <h2 className="gaming-title text-2xl lg:text-3xl font-bold text-neon-cyan mb-4">
            VAMOS CRIAR ALGO ÉPICO JUNTOS?
          </h2>
          <p className="text-lg text-led-white/80 mb-6 max-w-2xl mx-auto">
            Estamos prontos para embarcar na próxima aventura digital com você. 
            Seja parte da nossa história de sucesso!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={audioHelpers.playHover}
              onClick={() => {
                audioHelpers.playClick(true)
                trackingHelpers.trackClick('about_main_cta')
                
                // Navigate to contact page
                window.location.href = '/contato'
              }}
              className="gaming-button text-lg px-8 py-4"
            >
              <span className="relative z-10">INICIAR PROJETO</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={audioHelpers.playHover}
              onClick={() => {
                audioHelpers.playClick(false)
                trackingHelpers.trackClick('about_services_link')
              }}
              className="gaming-card px-8 py-4 text-lg font-semibold text-electric-blue border-electric-blue hover:text-controller-black hover:bg-electric-blue transition-all duration-300"
            >
              VER SERVIÇOS
            </motion.button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}