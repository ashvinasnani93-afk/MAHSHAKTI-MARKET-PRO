// ==========================================
// INDEX MASTER SERVICE (FOUNDATION)
// Central registry for all instruments
// NO SIGNAL | NO INDICATORS | RULE-LOCKED
// ==========================================

/**
 * INDEX / INSTRUMENT REGISTRY
 * Controls:
 * - Allowed symbols
 * - Segment visibility (Equity / Options / Commodity)
 * - Trade type permission
 * - Option chain availability
 * - UI grouping & priority
 */
const INDEX_REGISTRY = {
  // ==========================
  // NSE CORE INDEXES
  // ==========================
  NIFTY: {
    instrumentType: "INDEX",
    exchange: "NSE",
    category: "INDEX",
    uiLabel: "NIFTY 50",
    priority: 1,
    isCore: true,
    segments: ["EQUITY", "OPTIONS"],
    allowedTradeTypes: ["INTRADAY", "POSITIONAL"],
    optionChain: true,
    iconHint: "AUTO",
  },

  BANKNIFTY: {
    instrumentType: "INDEX",
    exchange: "NSE",
    category: "INDEX",
    uiLabel: "BANK NIFTY",
    priority: 2,
    isCore: true,
    segments: ["EQUITY", "OPTIONS"],
    allowedTradeTypes: ["INTRADAY", "POSITIONAL"],
    optionChain: true,
    iconHint: "AUTO",
  },

  FINNIFTY: {
    instrumentType: "INDEX",
    exchange: "NSE",
    category: "INDEX",
    uiLabel: "FIN NIFTY",
    priority: 3,
    isCore: false,
    segments: ["EQUITY", "OPTIONS"],
    allowedTradeTypes: ["INTRADAY"],
    optionChain: true,
    iconHint: "AUTO",
  },

  MIDCPNIFTY: {
    instrumentType: "INDEX",
    exchange: "NSE",
    category: "INDEX",
    uiLabel: "MIDCAP NIFTY",
    priority: 4,
    isCore: false,
    segments: ["EQUITY", "OPTIONS"],
    allowedTradeTypes: ["INTRADAY"],
    optionChain: true,
    iconHint: "AUTO",
  },

  // ==========================
  // BSE INDEX
  // ==========================
  SENSEX: {
    instrumentType: "INDEX",
    exchange: "BSE",
    category: "INDEX",
    uiLabel: "SENSEX",
    priority: 5,
    isCore: true,
    segments: ["EQUITY", "OPTIONS"],
    allowedTradeTypes: ["INTRADAY", "POSITIONAL"],
    optionChain: true,
    iconHint: "AUTO",
  },

  // ==========================
  // STOCK OPTIONS (STARTER SET)
  // ==========================
  RELIANCE: {
    instrumentType: "STOCK",
    exchange: "NSE",
    category: "STOCK",
    uiLabel: "RELIANCE",
    priority: 20,
    isCore: false,
    segments: ["EQUITY", "OPTIONS"],
    allowedTradeTypes: ["INTRADAY", "POSITIONAL"],
    optionChain: true,
    iconHint: "AUTO",
  },

  TCS: {
    instrumentType: "STOCK",
    exchange: "NSE",
    category: "STOCK",
    uiLabel: "TCS",
    priority: 21,
    isCore: false,
    segments: ["EQUITY", "OPTIONS"],
    allowedTradeTypes: ["INTRADAY", "POSITIONAL"],
    optionChain: true,
    iconHint: "AUTO",
  },

  // ==========================
  // VOLATILITY INDEX (DISPLAY ONLY)
  // ==========================
  VIX: {
    instrumentType: "INDEX",
    exchange: "NSE",
    category: "SYSTEM",
    uiLabel: "INDIA VIX",
    priority: 99,
    isCore: true,
    segments: ["DISPLAY_ONLY"],
    allowedTradeTypes: [],
    optionChain: false,
    iconHint: "INFO",
    note: "Used only for risk & safety context (no trading)",
  },
};

/**
 * getIndexConfig
 * @param {string} symbol
 * @returns {object|null}
 */
function getIndexConfig(symbol) {
  if (!symbol) return null;
  const key = symbol.toUpperCase();
  return INDEX_REGISTRY[key] || null;
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  getIndexConfig,
};
