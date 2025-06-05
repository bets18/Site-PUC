# PUC Foodie - Frontend

Sistema de autenticação para o restaurante da PUC-Rio.

## Tecnologias Utilizadas

- React.js
- Firebase Authentication (Precisa Configurar)
- TailwindCSS
- Lucide Icons

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd meu-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Firebase:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Substitua as configurações em `src/firebase.js` com suas credenciais

4. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## Estrutura do Projeto

```
meu-app/
├── src/
│   ├── App.js           # Componente principal com formulário de login/registro
│   ├── App.css          # Estilos principais
│   ├── firebase.js      # Configuração do Firebase
│   └── index.js         # Ponto de entrada da aplicação
├── public/
│   └── icone.ico        # Ícone da PUC
└── package.json         # Dependências e scripts
