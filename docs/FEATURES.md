# Alternance Hunter — workflow de prospection

## Implémenté
- Recherche d'entreprises par mot-clé et département via l'annuaire public.
- Pagination et affichage du siège (pas nécessairement l'établissement local).
- Sauvegarde PostgreSQL, unicité SIREN.
- Pipeline de candidature : à contacter, contact trouvé, candidature préparée, envoyée, relance, entretien, refus, accepté.
- Nom et email de contact, notes, date de relance.
- Tableau de bord avec compteur des relances à traiter.
- Filtre par statut, suppression de prospect, export CSV local.
- Recherche LinkedIn manuelle, brouillon/analyse Ollama sur demande.
- Aucune candidature envoyée automatiquement.

## Prochaines étapes
- Sources d'offres authentifiées (France Travail), déduplication et rafraîchissement planifié.
- Détection des établissements locaux et filtrage NAF pour réduire les faux positifs.
- Scoring explicable et embeddings via nomic-embed-text.
- Génération de brouillons d'emails personnalisés avec validation humaine.
- Tests backend/frontend, migrations Flyway, gestion d'erreurs externe, limites de débit, authentification locale.
- Vérification Docker/WSL2 et connectivité Ollama hôte.

**Attention :** les données publiques de l'annuaire ne prouvent pas qu'une entreprise recrute.
