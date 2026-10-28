# Alternance Hunter AI

Application locale de prospection d'alternance Bac+5 EADL, organisée en monorepo professionnel.

## Structure

- `backend/` : Java 21, Spring Boot, packages `controller/`, `service/`, `model/`, `repository/`, `dto/`
- `frontend/` : React + TypeScript, composants, services API, types, CSS séparé
- `docker-compose.yml` : PostgreSQL 16, Ollama, API et interface
- `.env.example` : variables à configurer, **sans secrets**

## Démarrer sur Windows + WSL2

Docker Desktop doit être installé et son intégration WSL2 activée.

```bash
git clone https://github.com/SDINAHET/alternance-hunter-ai.git
cd alternance-hunter-ai
cp .env.example .env
nano .env
docker compose config
docker compose up --build -d
docker compose ps
```

Remplacer `DB_PASSWORD` dans `.env` par un mot de passe fort.

- Interface : http://localhost:5173
- Backend : http://localhost:8099/api/health
- PostgreSQL : 127.0.0.1:5436
- Ollama : 127.0.0.1:11434

Premier démarrage : compilation Java, images Docker et téléchargement de `qwen2.5:7b` (plusieurs Go).

Vérifier : `docker compose logs -f backend`, `docker compose logs -f ollama-init`.

Arrêt sans perte de données : `docker compose down`. Ne pas exécuter `docker compose down -v` sauf si vous souhaitez supprimer la base et les modèles.

## Confidentialité et limites

Les secrets restent dans `.env`, ignoré par Git. Aucun CV privé dans le dépôt. Les ports Docker sont liés à 127.0.0.1 côté hôte.

Cette première version monorepo comprend la recherche d'entreprises, la persistance PostgreSQL et l'analyse Ollama à la demande. La collecte automatique d'offres, la vérification des emails professionnels et l'envoi de candidatures restent à développer. Les résultats d'entreprises ne sont pas des offres d'emploi vérifiées.

**Build et démarrage Docker non encore validés sur la machine cible.**
