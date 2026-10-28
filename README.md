# Alternance Hunter AI

Monorepo de prospection d'alternance Bac+5 EADL.

- `backend/` : Java 21 / Spring Boot, couches controller, service, model, repository, dto.
- `frontend/` : React / TypeScript, composants, services, types, styles CSS séparés.
- `docker-compose.yml` : PostgreSQL 16, backend, frontend.
- `start.sh` : démarrage simplifié de toute la stack.
- **Ollama n'est pas conteneurisé** : l'application réutilise ton modèle 8B déjà installé sur le PC. Aucun téléchargement de modèle n'est effectué.

## Installation Windows / WSL2

Prérequis : Docker Desktop + intégration WSL2, Docker Compose v2, curl et Ollama déjà installé avec au moins un modèle (`ollama list`).

```bash
git clone https://github.com/SDINAHET/alternance-hunter-ai.git
cd alternance-hunter-ai
cp .env.example .env
nano .env
bash start.sh
```

Dans `.env`, remplacer `DB_PASSWORD` par un mot de passe fort. Facultatif : renseigner `OLLAMA_MODEL` avec le nom exact affiché par `ollama list`. Si laissé vide, le script tente de sélectionner le premier modèle existant.

Ports :
- Frontend : http://localhost:5173
- Backend : http://localhost:8099/api/health
- PostgreSQL : 127.0.0.1:5436
- Ollama existant : http://localhost:11434

`bash start.sh` fonctionne même si le fichier n'a pas le bit exécutable après le clone. Pour utiliser `./start.sh`, lancer une fois `chmod +x start.sh`.

## Connexion à Ollama installé sur le PC

Le backend Docker contacte `http://host.docker.internal:11434`. Sur Docker Desktop, ce nom pointe vers la machine hôte. **Attention** : si Ollama n'écoute que sur `127.0.0.1` et que Docker n'arrive pas à le joindre, le frontend et PostgreSQL démarreront mais l'analyse IA échouera.

Tester depuis le conteneur backend :
```bash
docker compose exec backend sh -c 'curl -fsS http://host.docker.internal:11434/api/tags || true'
```
(L'image Java minimale peut ne pas inclure curl ; utiliser une image curl sur le même réseau si nécessaire.)

Pour rendre Ollama accessible aux conteneurs, adapter sa configuration d'écoute réseau **en limitant l'accès par le pare-feu à l'hôte et au réseau Docker**. Ne jamais exposer l'API Ollama sur Internet. Sous Windows, la configuration varie selon que le serveur Ollama tourne dans Windows ou WSL2.

## Dépannage

```bash
docker compose ps
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
ollama list
curl http://localhost:8099/api/health
```

Arrêter sans effacer les données : `docker compose down`. **Ne pas utiliser `down -v`** sauf pour supprimer volontairement la base PostgreSQL.

## Confidentialité et limites

`.env` est ignoré par Git ; ne pas publier de CV personnel, emails privés ou secrets. Les ports Docker sont publiés sur localhost. La recherche d'entreprises et la sauvegarde PostgreSQL sont implémentées ; l'enrichissement de contacts, les offres France Travail et l'envoi des candidatures restent à développer.

La compilation et l'intégration Docker doivent encore être validées sur ton PC.
