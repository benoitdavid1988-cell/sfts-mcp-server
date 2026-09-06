# Studio From The Sea — Serveur MCP

Serveur [Model Context Protocol](https://modelcontextprotocol.io/) réel et fonctionnel pour [Studio From The Sea](https://studiofromthesea.fr/), agence de visibilité IA pour artisans du bâtiment et TPE en Bretagne.

**Endpoint en production** : `https://studiofromthesea.fr/mcp`

Aucune authentification requise — les deux outils exposés ne renvoient que des faits publics et statiques déjà présents sur le site (prix, couverture géographique), jamais de donnée personnelle ou de calcul dynamique.

## Outils exposés

### `get_offers`
Retourne les 3 offres tarifaires fixes de Studio From The Sea (prix, ce qui est inclus, pour qui), sans abonnement obligatoire.

### `list_coverage`
Retourne la zone géographique couverte et le nombre de communes avec une page dédiée par métier (électricien, plombier, couvreur, maçon, menuisier, peintre, plâtrier).

## Essayer en direct

```bash
curl -X POST https://studiofromthesea.fr/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Déploiement

Ce fichier est une [Cloudflare Pages Function](https://developers.cloudflare.com/pages/functions/) — à placer dans `functions/mcp.js` à la racine d'un projet Cloudflare Pages. Aucune dépendance externe.

## Ressources liées

- [Agent Card A2A](https://studiofromthesea.fr/.well-known/agent-card.json)
- [Catalogue d'API (RFC 9727)](https://studiofromthesea.fr/.well-known/api-catalog)
- [Carte du serveur MCP](https://studiofromthesea.fr/.well-known/mcp/server-card.json)
- [Index de compétences](https://studiofromthesea.fr/.well-known/agent-skills/index.json)

## Licence

MIT — voir [LICENSE](./LICENSE).

## Contact

Studio From The Sea, Lancieux (22770) — [studiofromthesea.fr](https://studiofromthesea.fr/) — studiofromthesea@gmail.com
