# PUC Foodie - Frontend

Sistema de autenticação para o restaurante da PUC-Rio.

## 🚀 Tecnologias Utilizadas

- React.js
- Firebase Authentication
- TailwindCSS
- Lucide Icons

## 📋 Pré-requisitos

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

## 🏗️ Estrutura do Projeto

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
```

## 🔒 Funcionalidades de Autenticação

### Registro de Usuário
- Nome completo
- Email
- Telefone
- Data de nascimento
- Senha (mínimo 8 caracteres)

### Login
- Email
- Senha

## 🔌 Integração com Backend

### Endpoints Necessários

1. **Registro de Usuário**
   ```
   POST /api/auth/register
   {
     "fullName": string,
     "email": string,
     "phone": string,
     "birthDate": string,
     "password": string
   }
   ```

2. **Login**
   ```
   POST /api/auth/login
   {
     "email": string,
     "password": string
   }
   ```

### Respostas Esperadas

- Sucesso: `200 OK` com token JWT
- Erro de validação: `400 Bad Request`
- Erro de autenticação: `401 Unauthorized`
- Erro do servidor: `500 Internal Server Error`

## 🎨 Estilo e Tema

### Cores
- Azul Principal: `#002347`
- Dourado: `#D9A93A`
- Dourado Hover: `#c49430`

### Fontes
- Títulos: Playfair Display
- Texto: System default

## 🔄 Estado do Projeto

- [x] Interface de usuário
- [x] Validações de formulário
- [x] Integração com Firebase
- [ ] Integração com backend próprio
- [ ] Testes automatizados
- [ ] Deploy em produção

## 📝 Próximos Passos

1. Implementar backend com os endpoints necessários
2. Adicionar validação de token JWT
3. Criar sistema de recuperação de senha
4. Implementar verificação de email
5. Adicionar testes automatizados

## 👥 Autores

- Frontend: Rafa
- Design: [Nome do Designer]

## 📄 Licença

Este projeto está sob a licença [TIPO_DE_LICENÇA].
