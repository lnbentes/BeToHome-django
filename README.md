# BeTo's House - Eco-Home Manager

Este projeto foi migrado de React para **Django (Python 3)**, seguindo os princípios de Progressive Web Apps (PWA) e Clean Architecture.

## Tecnologias

- **Backend:** Django 5.x, Django Rest Framework (DRF)
- **Frontend:** SPA (Single Page Application) com Django Templates, Vanilla JS (ES6) e Tailwind CSS
- **Design:** Tema Earth & Forest com Chart.js
- **Banco de Dados:** SQLite

## Como rodar

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

## Autenticação

Acesse com os usuários do mock: `papai`, `mamae` ou `filho` (senha: `123456`).
Admin em `http://localhost:8000/admin/` (admin/admin).
