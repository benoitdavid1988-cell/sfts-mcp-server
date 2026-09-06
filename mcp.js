// Serveur MCP minimal pour studiofromthesea.fr (Cloudflare Pages Function).
// Expose uniquement des faits reels et statiques du site (offres, zones
// couvertes) -- aucune donnee inventee, aucun appel externe non verifie.
// Transport HTTP simple (JSON-RPC 2.0, une requete = une reponse), pas de
// streaming SSE : suffisant pour les deux outils exposes ici.

const OFFERS = [
  {
    id: "fiche-corrigee",
    nom: "Fiche corrigée",
    prix: "600 € HT, devis établi une fois vos besoins connus",
    pour_qui: "Pas de site à toucher, seulement votre présence en ligne existante.",
    inclus: [
      "Audit de votre fiche Google Business et/ou de votre site",
      "Fiche réécrite et complétée (horaires, services, photos)",
      "Mise en valeur de vos avis existants",
      "Texte qui répond aux vraies questions (zone, urgence, devis)",
      "Test avant / après",
    ],
  },
  {
    id: "site-remis-a-niveau",
    nom: "Site remis à niveau",
    prix: "1 900 € HT, devis ajusté selon l'état du site",
    pour_qui: "Vous avez déjà un site, même ancien, qu'on ne veut pas reconstruire de zéro.",
    inclus: [
      "Votre site actuel, réorganisé pour être mieux trouvé, rien n'est jeté",
      "Contenu entièrement réécrit, page par page",
      "Même travail d'optimisation que l'Offre 1",
      "Test avant / après",
    ],
  },
  {
    id: "site-neuf",
    nom: "Site neuf, construit pour être trouvé",
    prix: "3 200 € TTC, soit 2 667 € HT",
    pour_qui: "Vous n'avez pas de site, ou le vôtre est à refaire entièrement.",
    inclus: [
      "Site entièrement reconstruit, pensé pour être trouvé facilement dès le départ",
      "Une page dédiée pour chaque service, et pour chaque ville où vous travaillez",
      "Travail ciblé sur la réponse IA de Google : fiche, avis, réponses aux vraies questions",
      "Test avant / après sur votre métier et votre ville",
    ],
  },
];

// Compte reel des pages villexmetier deployees, derive au moment du build
// du generateur (regen_pseo_pages.py) -- fige ici pour eviter un appel
// disque a chaque requete MCP. A resynchroniser manuellement si le corpus
// pSEO change significativement.
const COVERAGE = {
  zone: "Côte d'Émeraude, Ille-et-Vilaine, Côtes-d'Armor",
  metiers: {
    electricien: 40,
    couvreur: 21,
    macon: 21,
    menuisier: 21,
    peintre: 21,
    platrier: 21,
    plombier: 21,
  },
  note: "Nombre de communes avec une page dédiée par métier, au dernier déploiement. Chaque page contient des données réelles vérifiées (population INSEE, part du bâti ancien) — aucune ville n'est ajoutée sans donnée vérifiée.",
};

const TOOLS = [
  {
    name: "get_offers",
    description:
      "Retourne les 3 offres tarifaires fixes de Studio From The Sea (prix, ce qui est inclus, pour qui), sans abonnement obligatoire.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_coverage",
    description:
      "Retourne la zone géographique couverte et le nombre de communes avec une page dédiée par métier (électricien, plombier, couvreur, maçon, menuisier, peintre, plâtrier).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function jsonRpcResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function toolContent(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return Response.json(jsonRpcError(null, -32700, "Parse error"), { status: 400 });
  }

  const { id, method, params } = body || {};

  if (method === "notifications/initialized") {
    return new Response(null, { status: 202 });
  }

  if (method === "initialize") {
    return Response.json(
      jsonRpcResult(id, {
        protocolVersion: "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "studiofromthesea-mcp", version: "1.0.0" },
      })
    );
  }

  if (method === "tools/list") {
    return Response.json(jsonRpcResult(id, { tools: TOOLS }));
  }

  if (method === "tools/call") {
    const name = params?.name;
    if (name === "get_offers") {
      return Response.json(jsonRpcResult(id, toolContent({ offres: OFFERS })));
    }
    if (name === "list_coverage") {
      return Response.json(jsonRpcResult(id, toolContent(COVERAGE)));
    }
    return Response.json(jsonRpcError(id, -32602, `Outil inconnu : ${name}`), { status: 404 });
  }

  return Response.json(jsonRpcError(id ?? null, -32601, `Méthode inconnue : ${method}`), { status: 404 });
}

export async function onRequestGet() {
  return Response.json({
    name: "studiofromthesea-mcp",
    protocol: "Model Context Protocol",
    transport: "HTTP JSON-RPC 2.0 (POST)",
    tools: TOOLS.map((t) => t.name),
  });
}
