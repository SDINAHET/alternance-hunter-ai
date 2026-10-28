# Alternance Hunter — fonctionnalités

## Implémenté dans le code
- Architecture Java 21 Spring Boot en couches, React TypeScript et PostgreSQL.
- Recherche d'entreprises via annuaire public, prospects, suivi des statuts, contacts saisis manuellement, dates de relance, notes, export CSV.
- API France Travail : authentification client credentials, import d'offres, déduplication par identifiant source, stockage PostgreSQL. **Nécessite des identifiants valides et des droits API.**
- Planification des synchronisations France Travail (désactivée par défaut, activable via .env).
- Ollama local : llama3.1:8b pour rédaction, qwen3-coder pour analyse technique, nomic-embed-text pour similarité cosinus.
- Espace IA frontend : brouillon d'email, scoring de profil/offre, préparation technique.
- GitHub Actions : vérification Maven, build React et validation Docker Compose.

## Non implémenté / limitations
- Découverte automatique vérifiée des coordonnées RH (lien de recherche LinkedIn uniquement).
- Analyse du CV PDF et stockage sécurisé de documents.
- Recherche multi-sources et classement automatique des offres par score.
- Envoi d'emails, candidature automatisée ou relances automatiques : **aucun envoi**.
- Tests E2E et couverture exhaustive, gestion complète des erreurs API et migrations Flyway.
- Aucune compilation Docker exécutée sur le PC de l'utilisateur ; CI ajoutée mais statut de réussite non vérifié.

Les trois modèles sont utilisés **sur demande**, pas nécessairement simultanément en RAM. Ne pas publier le CV ni les données privées.
