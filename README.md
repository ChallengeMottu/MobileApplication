# 🏍️ Pulse 

## ❓ O que somos? 
A Solução Pulse é uma proposta para otimizar a gestão dos pátios da empresa Mottu, responsável pela alocação e controle de motos. Buscamos, por meio da integração entre sistemas Back end, Front end e tecnologia IoT, 
solucionar o gerenciamento e identificação das motos. 

Para esse objetivo, o desenvolvimento da nossa interface Front end é de grande importância, visto que por meio desta, haverá o acesso dos colaboradores Mottu para a inspeção diária dos pátios.

---

## 🖥️ Telas da Interface
- Tela Principal: tela com explicações sobre a marca e a ideia da proposta;
- Tela de Cadastro do Funcionário: formulário com os dados necessários sobre o colaborador;
- Tela de Login: autenticação para permitir acesso do colaborador;
- Tela da Equipe: mostra o grupo desenvolvedor do projeto;
- Tela de Informações do usuário: inicio do acesso do colaborador, com as opções que ele tem a realizar nos patios;
- Tela de Cadastro de Moto: formulário para cadastro com dados necessários de novas motos no sistema;
- Tela de Scanner: rastreamento via bluetooth dos beacons inseridos nas motos;
- Tela Dados da Moto: informações sobre a moto detectada.

## 🛠️ Tecnologias utilizadas
- React Native
- Estilização com StyleSheet
- React Picker
- IonIcons
- React Navigation
- Firebase Authentication (cadastro, login e atualização de senha)
- Axios (consumo da API Java para cadastro e gerenciamento de motos)  
- API Java para cadastro e gerenciamento de motos → [https://github.com/ChallengeMottu/JavaSystem.git]

## 🎯 Funcionalidades principais

✔️ Autenticação segura de usuários com Firebase

✔️ Cadastro e gerenciamento de motos integrado ao backend em Java

✔️ Interface intuitiva para uso pelos colaboradores da Mottu

---


### 📂 Estrutura de Pastas

```bash
MobileApplication/
│── .expo/                  # Configurações do Expo
│── assets/                 # Imagens, ícones e outros recursos estáticos
│── node_modules/           # Dependências do projeto
│── src/                    # Código-fonte principal da aplicação
│
│── .gitignore              # Arquivos e pastas ignorados pelo Git
│── App.js                  # Componente principal da aplicação
│── app.json                # Configurações do Expo
│── index.js                # Arquivo de entrada do app
│── package.json            # Dependências e scripts do projeto
│── package-lock.json       # Controle de versões das dependências
│── README.md               # Documentação do projeto
│── tsconfig.json           # Configurações TypeScript (se aplicável)
```

## 📱 Executar o projeto

1. **Clone o repositório do aplicativo:**

```bash
git clone https://github.com/ChallengeMottu/MobileApplication.git
cd MobileApplication
```

2. **Instale as dependências**

```bash
npm install
```

3.**Execute o app** (se estiver usando Expo)

```bash
npx expo start
```

## 👥 Grupo Desenvolvedor
- Gabriela de Sousa Reis - RM558830
- Laura Amadeu Soares - RM556690
- Raphael Lamaison Kim - RM557914

