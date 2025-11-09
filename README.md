# 🏍️ Pulse - Sistema de Gestão de Frota Motofácil

## 📋 Sobre o Projeto
O **Pulse** é um sistema mobile completo para gestão inteligente de frotas de motocicletas, desenvolvido para a **Mottu**, a maior frota de motos da América Latina.  
A aplicação oferece controle em tempo real, rastreamento via beacon Bluetooth e gestão operacional integrada.

## 🎯 Objetivo
Otimizar a gestão da frota de mais de 100.000 motos utilizando tecnologia IoT, proporcionando:

- Controle preciso da localização das motos
- Gestão eficiente de entrada e saída no pátio
- Monitoramento em tempo real do status operacional
- Sistema de notificações e alertas inteligentes

---

## 👥 Participantes do Projeto

| Nome | RM | Função |
|------|------|------|
| Gabriela de Sousa Reis | RM558830 | Desenvolvedora Full Stack |
| Laura Amadeu Soares | RM556690 | Desenvolvedora Full Stack |
| Raphael Lamaison Kim | RM557914 | Desenvolvedor Full Stack |

---

## 🚀 Funcionalidades Principais

### 👥 Múltiplos Tipos de Usuários
- **Visitante:** Visualização informativa
- **Funcionário:** Operações de cadastro e movimentação
- **Mecânico:** Atualização do status mecânico das motos
- **Administrador:** Visão geral e relatórios avançados

### 📱 Módulos do Sistema

#### 🔐 Autenticação
- Login seguro com Firebase Authentication
- Cadastro de perfis diferentes
- Recuperação de senha
- Controle de acesso baseado em função

#### 🏍️ Gestão de Motos
- Cadastro completo (placa, modelo, chassi, status)
- Estados: Disponível, Manutenção, Inoperante
- Histórico de atualizações
- Controle operacional

#### 📍 Rastreamento e Localização
- Associação de moto a beacon via Bluetooth Low Energy (BLE)
- Mapa interativo com visualização da frota
- Localização rápida no pátio por alarme sonoro

#### 🔄 Fluxo Operacional
- Entrada e saída de motos do pátio
- Scanner de QR Code para controle
- Atualização instantânea de status

#### 📊 Dashboard e Analytics
- Métricas gerais da frota
- Histórico operacional de movimentação
- Visão por status e categorias

#### 🔧 Módulo de Manutenção
- Diagnóstico técnico
- Controle de tempo em manutenção
- Histórico de reparos

#### 🌐 Internacionalização
- Interface em Português e Espanhol
- Troca dinâmica de idioma

#### 🔔 Notificações
- Alertas de novos registros
- Mudanças de status e movimentações
- Confirmações de operações

---

## 🛠️ Tecnologias Utilizadas

### 📱 Frontend Mobile
- React Native com Expo
- TypeScript
- React Navigation (Drawer e Stack)
- Context API
- React i18next

### 🎨 UI e Experiência
- Design System customizado
- Temas claro e escuro
- Ícones Expo Vector Icons
- Fontes Darker Grotesque
- Animações com React Native Animated

### 🔧 Backend e Infraestrutura
- Firebase Authentication
- Firestore Database
- Async Storage
- Expo Notifications

### 📊 Funcionalidades Avançadas
- BLE para rastreamento via beacon
- Scanner de QR Code
- Mapas interativos com React Native Maps
- DateTime Picker
- Gerenciamento de permissões

---

## 🏗️ Arquitetura do Projeto

src/
├── Components/ # Componentes reutilizáveis
├── Screens/ # Telas da aplicação
├── context/ # Contextos (tema, autenticação, etc.)
├── configurations/ # Firebase e outras configs
├── services/ # Internacionalização, lógica auxiliar
└── assets/ # Imagens, ícones e fontes

## 📲 Telas Principais

### 🏠 Telas Públicas
- Tela Inicial
- Tela Login
- Tela Equipe (sobre os desenvolvedores)

### 👨‍💼 Funcionário
- Dashboard
- Cadastro de motos
- Consulta de motos
- Entrada no pátio
- Scanner de saída
- Mapa de localização
- Informações do usuário

### 🔧 Mecânico
- Dashboard
- Atualização de status das motos

### ⚙️ Administrativo
- Dashboard
- Dashboard Analytics
- Histórico de fluxos
- Cadastro de mecânicos

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 16+
- Expo CLI
- Dispositivo móvel com Expo Go ou emulador

### Instalação
# Clone o repositório
git clone https://github.com/ChallengeMottu/MobileApplication.git

# Acesse o diretório
cd MobileApplication

# Instale dependências
npm install

# Rode o projeto
npx expo start
