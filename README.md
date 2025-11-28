# Site de Controle Patrimonial

## 🧾 Descrição do projeto
O **Sistema de Controle Patrimonial** é uma aplicação web desenvolvida para auxiliar a Fundação Educere na gestão eficiente de seus bens patrimoniais. A plataforma permite o **cadastro, edição, exclusão e monitoramento de ativos** (como equipamentos, móveis e eletrodomésticos), facilitando o controle de informações como localização, modelo, data de aquisição, valores de aquisição e residual, depreciação e status de uso.

O sistema foi projetado para ser **intuitivo, seguro e responsivo**, possibilitando o acesso por diferentes tipos de usuários (administradores e visualizadores) a partir de qualquer dispositivo conectado à internet do local.

## ⚙️ Principais Funcionalidades
🔸 Gestão de Bens Patrimoniais;

🔸 Controle de Usuários;

🔸 Gestão de Localização;

🔸 Histórico e Auditoria;

🔸 Busca e Filtragem Avançadas;

🔸 Geração de QRCode com informações.

## 💻 Tecnologias Utilizadas
🔸 ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=000000)

🔸 ![React](https://img.shields.io/badge/-React-03588c?style=flat&logo=react&logoColor=ffffff)

🔸 ![Supabase](https://img.shields.io/badge/-Supabase-0d0d0d?style=flat&logo=supabase&logoColor=3ECF8E)

🔸 ![TailwindCss](https://img.shields.io/badge/-TailwindCSS-ffffff?style=flat&logo=TailwindCss&logoColor=06b6d4)

🔸 ![Express](https://img.shields.io/badge/-Express-f9f9f9?style=flat&logo=express&logoColor=0d0d0d)

🔸 ![Node.js](https://img.shields.io/badge/-Node.js-215732?style=flat&logo=node.js&logoColor=44883e)

## 📊 Benefícios
🔸 Redução de falhas e retrabalho no controle de bens;

🔸 Acesso rápido às informações patrimoniais;

🔸 QRCode com informações organizadas;

🔸 Melhor planejamento de manutenção de ativos;

🔸 Transparência e rastreabilidade nas movimentações de bens.

## 🐋 Pré-Requisitos
🔸 Instale o Node.js na sua máquina para nenhuma falha nesse link [Node.js](https://nodejs.org/pt/download) (opte por npm);

🔸 instale o docker desktop nesse link [Docker](https://docs.docker.com/desktop/setup/install/windows-install/);

🔸 Ao abrir o projeto em seu editor terminal, confirme que o node está instalado com;

```powershell
$ node --version
```

🔸 Em seguida, instale todas as dependencias de back e frontend;

```powershell
$ cd back
$ npm i
$ cd ../front
$ npm i
$ cd ..
$ npm i
```

🔸 Como estamos usando o docker-compose.yml, no terminal (Seja VS Code ou terminal do sistema), certifique de que está aberto na pasta correta e rode o seguinte comando:

## 🐋 Como rodar no Docker Desktop?
🔸 Primeiramente, dê commit nas alterações (via Github Desktop ou comandos git);

🔸 Em seguida, vá para o computador host (que "libera" o patrimonio.edu) e abra o repositório onde está o Site (SitePatrimonioEdu) no VS Code ou terminal;

🔸 Certifique-se que o push está dado e que você está mexendo na versão mais recente do código;

🔸 Como estamos usando o docker-compose.yml, no terminal (Seja VS Code ou terminal do sistema), certifique de que está aberto na pasta correta e rode o seguinte comando(Para alteração):

```bash
$ docker compose up --build -d
```
🔸 Como estamos usando o docker-compose.yml, no terminal (Seja VS Code ou terminal do sistema), certifique de que está aberto na pasta correta e rode o seguinte comando(Para subir projeto):

```bash
$ docker compose up
```

## 👥 Integrantes do projeto


| Integrante          | GitHub                                               | Principais Contribuições                                                                                          |
| ------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 🧩 **Sara Guaiume** | [saraqwe123](https://github.com/saraqwe123) | Responsável pela versão alpha do projeto |
| 🎨 **Bruno Pena**  | [brunpena](https://github.com/brunpena/) | Responsável pelo início da versão que, posteriormente, seria a versão oficial |
| ⚙️ **Pedro Utumi**  | [PedrinnhoUtumi](https://github.com/PedrinnhoUtumi/) | Responsável pela refatoração e término do projeto |
