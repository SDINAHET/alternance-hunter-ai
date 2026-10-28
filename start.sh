#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
say(){ printf '\n[Alternance Hunter] %s\n' "$*"; }
die(){ printf '[Erreur] %s\n' "$*" >&2; exit 1; }
command -v docker >/dev/null || die "Docker absent. Installer Docker Desktop et activer WSL2."
docker info >/dev/null 2>&1 || die "Docker Engine indisponible. Démarrer Docker Desktop."
docker compose version >/dev/null 2>&1 || die "Docker Compose v2 requis."
command -v curl >/dev/null || die "curl requis."
if [[ ! -f .env ]]; then
  cp .env.example .env
  chmod 600 .env
  die "Fichier .env créé. Configure DB_PASSWORD puis relance ./start.sh."
fi
# Read the model setting only; Docker Compose reads all other secrets itself.
model="$(sed -n 's/^OLLAMA_MODEL=//p' .env | tail -n 1 | tr -d '\r"')"
if [[ -z "$model" ]]; then
  if command -v ollama >/dev/null 2>&1; then
    model="$(ollama list 2>/dev/null | awk 'NR==2 {print $1}')"
  fi
  if [[ -z "$model" ]] && command -v python3 >/dev/null 2>&1; then
    model="$(curl -fsS --max-time 3 http://localhost:11434/api/tags 2>/dev/null | python3 -c 'import sys,json; x=json.load(sys.stdin).get("models",[]); print(x[0].get("name","") if x else "")' 2>/dev/null || true)"
  fi
fi
[[ -n "$model" ]] || die "Aucun modèle Ollama détecté. Exécute 'ollama list', puis renseigne OLLAMA_MODEL dans .env."
export OLLAMA_MODEL="$model"
say "Modèle existant sélectionné : $OLLAMA_MODEL (aucun téléchargement Ollama)"
if ! curl -fsS --max-time 4 http://localhost:11434/api/tags >/dev/null; then
  say "Attention : Ollama n'est pas joignable sur localhost:11434 depuis ce shell."
  say "Démarre Ollama sur ton PC avant d'utiliser l'analyse IA."
fi
say "Vérification de la configuration Docker…"
docker compose config --quiet
say "Démarrage PostgreSQL + Spring Boot + React…"
docker compose up --build -d --remove-orphans
say "Services :"
docker compose ps
say "Test API Java…"
for i in $(seq 1 25); do
  if curl -fsS --max-time 2 http://localhost:8099/api/health; then printf '\n'; break; fi
  if [[ "$i" -eq 25 ]]; then say "API pas encore prête. Logs : docker compose logs --tail=80 backend"; fi
  sleep 2
done
say "Interface : http://localhost:5173"
say "Ollama reste sur ton PC : aucun conteneur Ollama et aucun 'ollama pull'."
