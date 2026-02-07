import crypto from "crypto";
import OpenAI from "openai";
import { LedgerTransaction } from "./ledger";
import { SAMPLE_CLAIMS } from "./game-state";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

type StoredSession = {
  id: string;
  createdAt: number;
  expiresAt: number;
  transactions: LedgerTransaction[];
  hash: string;
};

// Use a global variable to persist sessions across HMR during development
const globalForSessions = global as unknown as {
  sessions: Map<string, StoredSession>;
};

const SESSIONS = globalForSessions.sessions || new Map<string, StoredSession>();

if (process.env.NODE_ENV !== "production") {
  globalForSessions.sessions = SESSIONS;
}

const SESSION_TTL_MS = 1000 * 60 * 60; // 1 hour

const LOCATIONS = [
  "Minahang Bayan - Bunawan, Agusan del Sur",
  "Minahang Bayan - Aroroy, Masbate",
  "Minahang Bayan - Itogon, Benguet",
  "Minahang Bayan - Paracale, Camarines Norte",
  "Minahang Bayan - Mt. Diwata, Davao de Oro",
  "Minahang Bayan - Surigao del Norte",
  "Minahang Bayan - Compostela Valley",
  "BSP Minting and Refinery - Quezon City",
  "BSP Regional Office - Davao City",
  "BSP Regional Office - Cebu City",
];

const SELLERS = [
  "Aurelius Gold Trading Co.",
  "Pacific Rim Resources Inc.",
  "Orient-Pacific Metals Group",
  "Gilded Philippine Imports",
  "Auric Southeast Holdings",
  "Luzon Precious Metals",
  "Visayas Mining & Export",
  "Mindanao Bullion Corp",
];

const BUYERS = [
  "Bangko Sentral ng Pilipinas (BSP)",
  "BSP Quezon City Refinery",
  "BSP Integrated Mint",
  "Philippine Gold Reserve",
];

function sha256(obj: any) {
  const str = JSON.stringify(obj, null, 2);
  return crypto.createHash("sha256").update(str).digest("hex");
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function randomDateWithinMonths(months = 12) {
  const now = Date.now();
  const ms = 1000 * 60 * 60 * 24 * 30 * months;
  const t = now - Math.floor(Math.random() * ms);
  const d = new Date(t);
  return d.toISOString().slice(0, 10);
}

export function generateSessionLedger(count = 8): {
  id: string;
  transactions: LedgerTransaction[];
  hash: string;
} {
  const sessionId = crypto.randomBytes(16).toString("hex");
  const transactions: LedgerTransaction[] = Array.from({ length: count }).map(
    (_, idx) => {
      const year = new Date().getFullYear();
      const code = crypto.randomBytes(3).toString("hex").toUpperCase();
      const id = `TXN-${year}-${code}`;
      return {
        id,
        gold_weight_kg: randomInt(45, 450),
        date: randomDateWithinMonths(18),
        location: randomElement(LOCATIONS),
        status: Math.random() > 0.08 ? "confirmed" : "pending",
        seller: randomElement(SELLERS),
        buyer: randomElement(BUYERS),
      };
    },
  );

  // Inject 0-2 legitimate claims from SAMPLE_CLAIMS into the ledger so not all claims are "lies"
  const injectedCount = randomInt(0, Math.min(2, SAMPLE_CLAIMS.length));
  const injectedIndices = new Set<number>();
  while (injectedIndices.size < injectedCount) {
    injectedIndices.add(randomInt(0, SAMPLE_CLAIMS.length - 1));
  }

  Array.from(injectedIndices).forEach((claimIdx) => {
    const claim = SAMPLE_CLAIMS[claimIdx];
    // Replace a random entry with a matching one
    const replaceIdx = randomInt(0, transactions.length - 1);
    transactions[replaceIdx] = {
      id: `TXN-LEGIT-${claim.id}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
      gold_weight_kg: claim.gold_weight_kg,
      date: claim.claimed_date,
      location: claim.claimed_location,
      status: "confirmed",
      seller: claim.claimant_name,
      buyer: randomElement(BUYERS),
    };
  });

  const hash = sha256(transactions);

  return { id: sessionId, transactions, hash };
}

/**
 * Validate a parsed transaction object loosely to ensure required fields exist.
 */
function isValidLedgerTx(obj: any): obj is LedgerTransaction {
  if (!obj || typeof obj !== "object") return false;
  const required = [
    "id",
    "gold_weight_kg",
    "date",
    "location",
    "status",
    "seller",
    "buyer",
  ];
  for (const k of required) if (!(k in obj)) return false;
  if (typeof obj.id !== "string") return false;
  if (typeof obj.gold_weight_kg !== "number") return false;
  if (typeof obj.date !== "string") return false;
  if (typeof obj.location !== "string") return false;
  if (!["confirmed", "pending", "disputed"].includes(obj.status)) return false;
  if (typeof obj.seller !== "string") return false;
  if (typeof obj.buyer !== "string") return false;
  return true;
}

/**
 * Ask OpenAI to generate a small Philippine-context ledger of transactions.
 * Falls back to the local random generator when the API key is missing or parsing fails.
 */
export async function generateSessionLedgerAI(count = 3): Promise<{
  id: string;
  transactions: LedgerTransaction[];
  hash: string;
}> {
  // Fallback to local generator if OpenAI is not configured
  if (!openai) return generateSessionLedger(count);

  const sessionId = crypto.randomBytes(16).toString("hex");

  const system = `You are a data generator that MUST ONLY output a JSON array of ledger transaction objects.`;
  const user = `Generate ${count} simulated gold transaction records with a Filipino context. Each record must be a JSON object with exactly the following keys: id (string, format: TXN-YYYY-XXX), gold_weight_kg (number, integer between 50 and 450), date (ISO date YYYY-MM-DD within the past 18 months), location (Specific Philippine location MUST be one of: Minahang Bayan in Bunawan, Aroroy, Itogon, Paracale, or Mt. Diwata; or BSP Minting and Refinery), status (one of: confirmed, pending, disputed), seller (Filipino seller name or cooperative), buyer (e.g., "Bangko Sentral ng Pilipinas" or "BSP Integrated Mint"). Return ONLY a JSON array (no commentary, no surrounding text).`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
      max_tokens: 800,
    });

    const raw = res.choices?.[0]?.message?.content || "[]";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.warn("Failed to parse OpenAI ledger output, falling back:", e);
      return generateSessionLedger(count);
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      console.warn("OpenAI returned non-array ledger, falling back");
      return generateSessionLedger(count);
    }

    // Ensure we have exactly `count` valid transactions; otherwise fallback
    const txs: LedgerTransaction[] = [];

    for (let i = 0; i < parsed.length && txs.length < count; i++) {
      const candidate = parsed[i];

      // Coerce numeric types if they are strings
      if (candidate && typeof candidate.gold_weight_kg === "string") {
        const n = parseInt(candidate.gold_weight_kg.replace(/[^0-9]/g, ""), 10);
        if (!Number.isNaN(n)) candidate.gold_weight_kg = n;
      }

      if (isValidLedgerTx(candidate)) {
        // Normalize id format if needed
        if (!candidate.id.startsWith("TXN-")) {
          candidate.id = `TXN-${new Date().getFullYear()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
        }
        txs.push(candidate);
      }
    }

    // If OpenAI output didn't produce enough valid items, fallback to local generation for the remainder
    if (txs.length < count) {
      const needed = count - txs.length;
      const fallback = generateSessionLedger(needed).transactions;
      txs.push(...fallback);
    }

    const hash = sha256(txs);
    return { id: sessionId, transactions: txs, hash };
  } catch (err) {
    console.error("OpenAI ledger generation failed, falling back:", err);
    return generateSessionLedger(count);
  }
}

export async function createSessionWithAI(count = 3) {
  const { id, transactions, hash } = await generateSessionLedgerAI(count);
  const now = Date.now();
  const stored: StoredSession = {
    id,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    transactions,
    hash,
  };
  SESSIONS.set(id, stored);
  return stored;
}

export function createSession(count = 8) {
  const { id, transactions, hash } = generateSessionLedger(count);
  const now = Date.now();
  const stored: StoredSession = {
    id,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    transactions,
    hash,
  };
  SESSIONS.set(id, stored);
  return stored;
}

export function getSession(sessionId: string) {
  const s = SESSIONS.get(sessionId);
  if (!s) return null;
  // expire check
  if (Date.now() > s.expiresAt) {
    SESSIONS.delete(sessionId);
    return null;
  }
  return s;
}

export function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [k, v] of SESSIONS.entries()) {
    if (now > v.expiresAt) SESSIONS.delete(k);
  }
}

// Simple interval cleanup
setInterval(cleanupExpiredSessions, 1000 * 60 * 5);
