# Audio System Files

Sistema de áudio integrado com tema gaming/cyberpunk para PlayCode Agency.

## Estrutura de Pastas

```
sounds/
├── music/              # Música de fundo
├── sfx/
│   ├── ui/            # Sons de interface
│   ├── achievements/  # Sons de conquistas
│   ├── gaming/       # Sons de gaming
│   └── system/       # Sons de sistema
```

## Arquivos Necessários

### Música de Fundo (music/)
- `cyberpunk-ambient.mp3` - Música ambiente cyberpunk (loop)
- `cyberpunk-intense.mp3` - Música intensa para hero section (loop)
- `cyberpunk-chill.mp3` - Música relaxante para contato (loop)

### Sons de Interface (sfx/ui/)
- `click-primary.mp3` - Click de botão primário
- `click-secondary.mp3` - Click de botão secundário
- `hover-soft.mp3` - Som de hover suave
- `navigation.mp3` - Som de navegação

### Sons de Achievements (sfx/achievements/)
- `unlock-common.mp3` - Achievement comum
- `unlock-rare.mp3` - Achievement raro
- `unlock-epic.mp3` - Achievement épico
- `unlock-legendary.mp3` - Achievement lendário

### Sons de Gaming (sfx/gaming/)
- `powerup-select.mp3` - Seleção de power-up
- `level-up.mp3` - Level up
- `xp-gain.mp3` - Ganho de XP
- `konami-sequence.mp3` - Código Konami

### Sons de Sistema (sfx/system/)
- `boot-complete.mp3` - Boot completado
- `error.mp3` - Som de erro
- `notification.mp3` - Notificação
- `chatbot-beep.mp3` - Mensagem do chatbot

## Características dos Arquivos

### Formato
- **Formato**: MP3 (compatibilidade máxima)
- **Qualidade**: 128-192 kbps (balanço qualidade/tamanho)
- **Duração SFX**: 0.5-2 segundos
- **Duração Música**: 2-5 minutos (loop)

### Estilo Audio
- **Tema**: Cyberpunk/Gaming/Synthwave
- **Elementos**: Sintetizadores, beats eletrônicos, efeitos digitais
- **Volume**: Normalizado (-6dB peak)

## Onde Encontrar - Gaming Focus

### 🎮 Recursos Gaming Gratuitos Recomendados
- **OpenGameArt.org** - UI Sound Effects Library (105 SFX para menus)
- **SONNISS GameAudioGDC** - Archive profissional (milhares de sons)
- **Pixabay Game Sounds** - Achievement e game SFX
- **Mixkit Game Collection** - 36+ efeitos gaming gratuitos
- **GFX Sounds** - Especializado em rewards e power-ups

### 🎵 Música Cyberpunk/Synthwave
- **SoundCloud** - Playlists "Free Cyberpunk Music" 
- **Pixabay Synthwave** - Tracks como "Neon Mirage"
- **EdRecords** - Retrowave/Cyberpunk Ambient (no copyright)
- **Buscar por**: "retrowave", "synthwave", "outrun", "cyberpunk ambient"

### 🛠️ Ferramentas e Scripts
- **Script Automático**: `node scripts/download-audio.js`
- **Placeholder Mode**: `node scripts/download-audio.js --placeholder`
- **FFmpeg** - Para conversão OGG (opcional)

### 📝 Termos de Busca Gaming
- "cyberpunk UI sfx"
- "synthwave game audio"  
- "retro futuristic interface sounds"
- "neon electronic beeps"
- "glitch sound effects"
- "outrun game music"
- "digital achievement sounds"
- "holographic interface sfx"

## Implementação

O sistema de áudio está configurado para:
- ✅ Carregamento automático de arquivos prioritários
- ✅ Controle de volume independente (Master, Music, SFX)
- ✅ Fade in/out suave
- ✅ Prevenção de múltiplas instâncias
- ✅ Persistência de preferências
- ✅ Compatibilidade cross-browser
- ✅ Políticas de autoplay

## Status

- [x] Sistema base implementado
- [x] AudioManager criado
- [x] Hooks React configurados
- [x] Controles de UI implementados
- [x] Integração com achievements
- [ ] Arquivos de áudio adicionados
- [ ] Testes de compatibilidade