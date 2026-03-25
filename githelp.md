# Principais comandos Git

## Inicialização e configuração

```bash
git init                # Inicializa um repositório
git config --global user.name "Seu Nome"   # Configura nome
git config --global user.email "email@exemplo.com" # Configura email
```

## Status e histórico

```bash
git status              # Mostra status dos arquivos
git log                 # Mostra histórico de commits
```

## Adicionar e commitar

```bash
git add .               # Adiciona todos os arquivos
git add nome-arquivo    # Adiciona arquivo específico
git commit -m "Mensagem" # Faz commit
```

## Branches

```bash
git branch              # Lista branches
git branch nome         # Cria branch
git checkout nome       # Troca de branch
git merge nome          # Mescla branch
git branch -d nome      # Deleta branch local
git branch -D nome      # Deleta branch local forçado
git push origin --delete nome # Deleta branch remota
```

## Push e Pull

```bash
git push                # Envia commits para o remoto
git pull                # Baixa atualizações do remoto
```

## Clonar e atualizar

```bash
git clone url           # Clona repositório
git fetch               # Atualiza referências remotas
```

## Reverter e resetar

```bash
git revert hash         # Reverte commit
git reset --hard hash   # Reseta para commit específico
```

## Stash

```bash
git stash               # Salva alterações temporárias
git stash pop           # Recupera alterações
```

## Outros

```bash
git remote -v           # Lista remotos
git show                # Mostra detalhes de objeto
```

---

## Usando Git com repositório SSH

Exemplo de URL SSH:

```
ssh://192.168.1.161:/home/lnb/projetos/issueFlask.git
```

### Clonar repositório via SSH

```bash
git clone ssh://192.168.1.161:/home/lnb/projetos/issueFlask.git
```

### Adicionar remoto SSH

```bash
git remote add origin ssh://192.168.1.161:/home/lnb/projetos/issueFlask.git
```

### Configurar chave SSH

1. Gere uma chave:

```bash
ssh-keygen -t rsa -b 4096 -C "seu@email.com"
```

2. Adicione a chave ao servidor:

```bash
ssh-copy-id usuario@192.168.1.161
```

3. Teste a conexão:

```bash
ssh usuario@192.168.1.161
```

### Usar push/pull com SSH

```bash
git push origin master
git pull origin master
```

### Verificar remoto

```bash
git remote -v
```

### Trocar URL do remoto para SSH

```bash
git remote set-url origin ssh://192.168.1.161:/home/lnb/projetos/BeToHome-django.git
```
