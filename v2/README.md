# Alternance Hunter AI v2 — Docker

Version expérimentale **React + Spring Boot Java 21 + PostgreSQL + Ollama local**.

## Démarrage sous WSL2

Prérequis : Docker Desktop avec intégration WSL2 activée, Docker Compose v2, accès Internet et espace disque suffisant.

```bash
cd alternance-hunter-ai
git pull origin main
cd v2
cp .env.example .env
nano .env
```

Remplacer `DB_PASSWORD` par un mot de passe fort (sans espaces). Le fichier `.env` est ignoré par Git.

```bash
docker compose config
docker compose up --build -d
docker compose ps
docker compose logs -f backend
```

Interface : **http://localhost:5173**

API : **http://localhost:8099/api/health**

PostgreSQL : **localhost:5436** (hôte), base `hunter`, utilisateur `hunter`.

Ollama : **http://localhost:11434**. Le service `ollama-init` télécharge automatiquement le modèle `qwen2.5:7b` au premier démarrage (plusieurs Go, cela peut prendre du temps).

```bash
docker compose logs -f ollama-init
docker compose exec ollama ollama list
```

Arrêter sans effacer les données : `docker compose down`.

**Ne pas lancer `docker compose down -v`** : cette commande efface les données PostgreSQL et les modèles téléchargés.

## Limites actuelles

- Recherche d'entreprises via API publique, résultats bruts à qualifier.
- Prospects persistés dans PostgreSQL.
- Analyse Ollama sur demande, sans transmission du prompt à une API LLM externe.
- Recherche d'offres France Travail, enrichissement des emails, envoi de candidatures et automatisations planifiées **pas encore intégrés à la v2**.
- Aucun test de build Docker n'a pu être exécuté dans l'environnement de publication : le premier lancement sur le PC permettra de vérifier les images et dépendances.

## Sécurité

Les ports sont publiés sur 127.0.0.1 côté PC. Aucun secret dans Git. Ne jamais publier le CV personnel ou la base de prospection.
