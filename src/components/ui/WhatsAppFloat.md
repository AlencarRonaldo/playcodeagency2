# WhatsApp Float Component

Componente de botão flutuante do WhatsApp moderno com tema gaming/cyberpunk integrado ao sistema de áudio e design tokens da PlayCode Agency.

## Características

### Design Moderno 2024
- ✅ Gradientes neon com efeitos de brilho animados
- ✅ Micro-interações suaves com spring animations
- ✅ Tooltip contextual com informações da empresa
- ✅ Responsividade total (mobile-first)
- ✅ Badge de notificação animado
- ✅ Botões de ação rápida no hover

### Integração com Sistema
- ✅ Audio feedback integrado (hover, click)
- ✅ Tema gaming/cyberpunk consistente
- ✅ Z-index inteligente (não interfere com AudioControls)
- ✅ CSS variables do sistema gaming-tokens
- ✅ Acessibilidade completa (ARIA, keyboard)

### Funcionalidades Avançadas
- ✅ Auto-show após scroll (100px)
- ✅ Tooltip auto-display/hide
- ✅ Múltiplos pontos de contato (chat/call)
- ✅ Posicionamento inteligente
- ✅ Performance otimizada

## Props Interface

```typescript
interface WhatsAppFloatProps {
  phoneNumber?: string        // Número do WhatsApp (padrão: '5511999999999')
  message?: string           // Mensagem pré-definida
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  showTooltip?: boolean      // Exibir tooltip informativo
  companyName?: string       // Nome da empresa no tooltip
  className?: string         // Classes CSS adicionais
}
```

## Uso Básico

```tsx
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'

// Configuração padrão
<WhatsAppFloat />

// Configuração personalizada
<WhatsAppFloat 
  phoneNumber="5511987654321"
  position="bottom-left"
  companyName="Sua Empresa"
  showTooltip={true}
  message="Olá! Como posso ajudar?"
/>
```

## Posicionamento

### Configurações Disponíveis
- `bottom-left`: Canto inferior esquerdo (padrão)
- `bottom-right`: Canto inferior direito (offset para AudioControls)
- `top-left`: Canto superior esquerdo
- `top-right`: Canto superior direito

### Posicionamento Inteligente
- AudioControls em `bottom-right`: WhatsApp usa `bottom-left`
- Offset automático para evitar sobreposição
- Margens responsivas (24px desktop, adaptável mobile)

## Integração no Layout

### Layout.tsx
```tsx
import WhatsAppFloat from "@/components/ui/WhatsAppFloat"

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AchievementProvider>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
          
          {/* Floating elements - ordem importante para z-index */}
          <AudioControls position="bottom-right" />
          <AudioInitButton />
          <WhatsAppFloat 
            phoneNumber="5511999999999"
            position="bottom-left"
            companyName="PlayCode Agency"
            showTooltip={true}
            message="Olá! Gostaria de saber mais sobre os serviços da PlayCode Agency 🎮"
          />
          <KonamiEffects />
        </AchievementProvider>
      </body>
    </html>
  )
}
```

## Sistema de Z-Index

### Hierarquia Gaming Tokens
```css
--z-background: -1;
--z-base: 0;
--z-tooltip: 10;
--z-overlay: 20;
--z-modal: 30;
--z-whatsapp: 35;    /* ← WhatsApp Float */
--z-hud: 40;         /* ← AudioControls */
--z-notification: 50;
```

### Estratégia de Posicionamento
- WhatsApp (z: 35) fica abaixo de AudioControls (z: 40)
- Tooltips WhatsApp (z: 10) não interferem com HUD
- Evita conflitos visuais mantendo hierarquia

## Animações

### Entrada/Saída
- Spring animation (stiffness: 260, damping: 20)
- Delay inteligente (2s após load)
- Scale/opacity transition suave

### Micro-interações
- Hover: scale 1.05 + glow effect
- Click: scale 0.95 + audio feedback
- Pulse: border animation 2s infinite
- Background pattern animation no hover

### Performance
- AnimatePresence para mount/unmount otimizado
- GPU-accelerated transforms
- Debounced scroll handlers

## Acessibilidade

### ARIA Support
```tsx
aria-label="Entrar em contato via WhatsApp com PlayCode Agency"
```

### Keyboard Navigation
- Focusable com Tab
- Enter/Space para ativar
- Escape para fechar tooltip

### Screen Readers
- Descrições contextuais
- Status de conectividade
- Feedback de ações

## Customização

### Temas
O componente usa automaticamente as variáveis CSS do gaming-tokens:
- `--color-neon-cyan`: Cores principais
- `--gradient-main`: Gradientes
- `--font-gaming-mono`: Tipografia
- `--animation-fast`: Timing

### Override CSS
```css
.whatsapp-custom {
  --color-whatsapp-primary: #25d366;
  --color-whatsapp-dark: #128c7e;
}
```

### Props Avançadas
```tsx
<WhatsAppFloat 
  className="whatsapp-custom"
  phoneNumber="5511987654321"
  message="Mensagem personalizada com emojis 🚀"
  position="bottom-right"
  showTooltip={false}
/>
```

## Tracking & Analytics

### Eventos Automáticos
- Click tracking via audioHelpers
- Hover interactions
- Tooltip visibility

### Integração Sugerida
```tsx
const handleWhatsAppClick = () => {
  // Analytics tracking
  gtag('event', 'whatsapp_click', {
    phone_number: phoneNumber,
    source: 'floating_button'
  })
  
  audioHelpers.playClick()
  // ... rest of logic
}
```

## Considerações Mobile

### Responsividade
- Touch-friendly sizing (44px minimum)
- Hover states adaptados para touch
- Safe areas para notch/bottom bar

### Performance Mobile
- Reduced animations em `prefers-reduced-motion`
- Optimized images/assets
- Efficient scroll handlers

## Troubleshooting

### Problemas Comuns

**1. Z-index conflicts**
- Verificar hierarquia em gaming-tokens.css
- Usar inspect dev tools

**2. Audio não funciona**
- Verificar se useAudio hook está disponível
- Verificar audioHelpers import

**3. Tooltip não aparece**
- Verificar showTooltip prop
- Verificar timing de auto-display

**4. Position overlap**
- Ajustar position prop
- Verificar outros elementos flutuantes

### Debug Mode
```tsx
// Adicionar para debug
<WhatsAppFloat 
  className="debug-whatsapp"
  showTooltip={true}
  // ... outras props
/>
```

```css
.debug-whatsapp {
  border: 2px solid red !important;
  background: rgba(255,0,0,0.1) !important;
}
```