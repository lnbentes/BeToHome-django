
# BeTo's House - Eco-Home Manager

> Gerencie sua casa de forma sustentável! Aplicação Django PWA para tarefas, finanças, passeios e calendário familiar.

---

## 🏗️ Arquitetura & Tecnologias

- **Backend:** Django 5.x, Django REST Framework (DRF)
- **Frontend:** SPA Django Templates + Vanilla JS (ES6), Tailwind CSS
- **Design:** Tema Earth & Forest, Chart.js
- **Banco de Dados:** SQLite
- **PWA:** Manifesto, Service Worker, funcionamento offline

---

## 📁 Estrutura de Pastas

```
BeToHome-django/
├── app_core/           # App principal (modelos, views, serviços, rotas)
│   ├── models/         # Modelos: finance, task, place, calendar
│   ├── serializers/    # Serializers DRF
│   ├── services/       # Regras de negócio (FinanceService, TaskService...)
│   ├── routes/         # Rotas organizadas por domínio
│   ├── views/          # ViewSets DRF e views customizadas
│   ├── admin.py        # Admin Django customizado
│   ├── urls.py         # URLs do app_core
│   └── ...
├── config/             # Configurações do projeto Django
│   ├── settings.py
│   ├── urls.py         # Inclui rotas API e front
│   └── ...
├── front/              # Front-end SPA e arquivos PWA
│   ├── templates/      # base.html, index.html (SPA)
│   ├── static/
│   │   ├── manifest.json
│   │   ├── sw.js       # Service Worker
│   │   ├── css/
│   │   └── js/
│   └── urls.py         # Rotas para manifest e SW
├── requirements.txt    # Dependências
├── manage.py
└── ...
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

1. Crie e ative o ambiente virtual:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Instale as dependências:
   ```powershell
   pip install -r requirements.txt
   ```
3. Rode as migrações:
   ```powershell
   python manage.py migrate
   ```
4. Popule os dados iniciais:
   ```powershell
   python manage.py seed_data
   ```
5. Inicie o servidor:
   ```powershell
   python manage.py runserver
   ```

---

## 🔐 Autenticação

- Usuários de exemplo: `papai`, `mamae`, `filho` (senha: `123456`)
- Admin: [http://localhost:8000/admin/](http://localhost:8000/admin/) (admin/admin)

---

## 📲 PWA

- Manifesto em `/manifest.json` e Service Worker `/sw.js`
- Funciona offline (cache dos assets principais)
- Instale no celular ou desktop ("Adicionar à tela inicial")

---

## 🧪 Testes

- Testes unitários e de integração em `app_core/tests/`
- Use `pytest` ou `python manage.py test`

---

## 📜 Licença

MIT
