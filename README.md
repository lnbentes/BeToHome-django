
# BeTo's House - Eco-Home Manager

> Gerencie sua casa de forma sustentável! Aplicação Django PWA para tarefas, finanças, passeios e calendário familiar.

---

## 🏗️ Arquitetura & Tecnologias

- **Backend:** Django 5.x, Django REST Framework (DRF)
- **Frontend (Novo):** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Frontend (Legado):** SPA Django Templates + Vanilla JS (em processo de migração)
- **Design:** Tema Earth & Forest (Dark/Light mode nativo)
- **Banco de Dados:** SQLite

---

## 📁 Estrutura de Pastas

```
BeToHome-django/
├── app_core/           # App principal do Backend (modelos, views, serviços, rotas)
│   ├── models/         # Modelos: finance, task, place, calendar
│   ├── serializers/    # Serializers DRF
│   ├── services/       # Regras de negócio (FinanceService, TaskService...)
│   └── views/          # ViewSets DRF e views customizadas
├── config/             # Configurações do projeto Django (settings, urls)
├── front-react/        # NOVO Frontend em React
│   ├── src/
│   │   ├── components/ # Componentes base (Layout, Sidebar, Header)
│   │   ├── context/    # Contextos globais (AuthContext, ThemeContext, FinanceContext)
│   │   ├── screens/    # Telas da aplicação (Dashboard, Finance, Login...)
│   │   └── services/   # Integração com a API do Django via Axios
│   └── vite.config.ts  # Configuração do Vite e Proxy para o Django
├── front/              # Frontend legado em Vanilla JS (mantido para fallback)
├── requirements.txt    # Dependências do Python (Backend)
└── manage.py           # CLI do Django
```

---

## 🔗 Endpoints Principais (API REST)

Prefixo: `/api/`

- `/api/category/`         → Categorias financeiras
- `/api/account/`          → Contas
- `/api/transaction/`      → Transações
- `/api/task/`             → Tarefas
- `/api/place/`            → Passeios/Lugares
- `/api/calendarevent/`    → Eventos de calendário
- `/api/login/`            → Login customizado
- `/api/logout/`           → Logout

---

## 🧩 Serviços Internos

- `FinanceService`: Resumo financeiro mensal, transações do usuário
- `TaskService`: Listagem, conclusão de tarefas
- `PlaceService`: Passeios por usuário, não visitados
- `CalendarService`: Eventos futuros, por mês

---

## 🚀 Como rodar localmente

Como o projeto agora é dividido entre Django (Backend) e React (Frontend), você precisa rodar ambos os servidores simultaneamente em terminais diferentes.

### 1️⃣ Iniciando o Backend (Django)

No primeiro terminal, na pasta raiz do projeto (`BeToHome-django/`):

1. Crie e ative o ambiente virtual:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Instale as dependências:
   ```powershell
   pip install -r requirements.txt
   ```
3. Rode as migrações (se necessário):
   ```powershell
   python manage.py migrate
   ```
4. Popule os dados iniciais (Mock):
   ```powershell
   python manage.py seed_data
   ```
5. Inicie o servidor na porta 8000:
   ```powershell
   python manage.py runserver
   ```

### 2️⃣ Iniciando o Frontend (React)

Abra um **segundo terminal**, entre na pasta do frontend e inicie o Vite:

1. Acesse a pasta do React:
   ```powershell
   cd front-react
   ```
2. Instale os pacotes Node:
   ```powershell
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```powershell
   npm run dev
   ```

O Frontend estará disponível em **`http://localhost:5173`**. Ele fará proxy automático das chamadas `/api` para o Django rodando na porta `8000`.

---

## 🔐 Autenticação e Usuários Mockados

Para facilitar o desenvolvimento, o comando `python manage.py seed_data` cria usuários fictícios no banco de dados.

**Usuários da aplicação:**
- **Papai:** Login: `papai` | Senha: `123456`
- **Mamãe:** Login: `mamae` | Senha: `123456`
- **Filho:** Login: `filho` | Senha: `123456`

**Administrador do Django:**
- Acesse [http://localhost:8000/admin/](http://localhost:8000/admin/)
- Login: `admin` | Senha: `admin`

---

## 🧪 Testes

- Testes unitários e de integração em `app_core/tests/`
- Use `pytest` ou `python manage.py test`

---

## 📜 Licença

MIT
