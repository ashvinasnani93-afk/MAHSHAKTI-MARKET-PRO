// ==================================================
// OPTIONS SIGNAL ENGINE (PHASE-3)
// CORE BRAIN – RULE LOCKED
// NO DUMMY | NO SHORTCUT
// ==================================================

// ==========================================
// OPTIONS NO-TRADE ZONE (FOUNDATION)
// Sideways / Noise market protection
// ==========================================
function isNoTradeZone({ spotPrice, ema20, ema50 }) {
  if (
    typeof spotPrice !== "number" ||
    typeof ema20 !== "number" ||
    typeof ema50 !== "number"
  ) {
    return false;
  }

  // EMA compression check
  const emaDiffPercent =
    (Math.abs(ema20 - ema50) / spotPrice) * 100;

  // Price too close to EMA (noise zone)
  const priceNearEMA =
    (Math.abs(spotPrice - ema20) / spotPrice) * 100 < 0.15;

  if (emaDiffPercent < 0.2 && priceNearEMA) {
    return true;
  }

  return false;
}

/**
 * generateOptionsSignal
 * @param {object} context
 * @returns {object}
 *
 * Context comes ONLY from optionsMaster.service
 */
function generateOptionsSignal(context = {}) {
  const {
    symbol,
    spotPrice,
    expiryType,
    tradeContext,
    safety,

    ema20,
    ema50,
    rsi,
    vix, // optional (future safety)
  } = context;

  // --------------------------------------------------
  // HARD INPUT VALIDATION
  // --------------------------------------------------
  if (!symbol || typeof spotPrice !== "number") {
    return {
      status: "WAIT",
      reason: "Invalid symbol or spot price",
    };
  }

  if (!expiryType || !tradeContext) {
    return {
      status: "WAIT",
      reason: "Missing expiry or trade context",
    };
  }

  // --------------------------------------------------
  // SAFETY GATE (NON-NEGOTIABLE)
  // --------------------------------------------------
  if (!safety) {
    return {
      status: "WAIT",
      reason: "Safety context missing",
    };
  }

  if (safety.isExpiryDay || safety.isResultDay) {
    return {
      status: "WAIT",
      regime: "HIGH_RISK",
      buyerAllowed: false,
      sellerAllowed: false,
      reason: "Result / expiry day risk",
    };
  }

  if (
    tradeContext === "INTRADAY_OPTIONS" &&
    !safety.intradayAllowed
  ) {
    return {
      status: "WAIT",
      reason: "Intraday options not allowed by safety layer",
    };
  }

  if (
    tradeContext === "POSITIONAL_OPTIONS" &&
    !safety.positionalAllowed
  ) {
    return {
      status: "WAIT",
      reason: "Positional options not allowed by safety layer",
    };
  }

  // --------------------------------------------------
  // TREND CHECK (EMA 20 / EMA 50)
  // --------------------------------------------------
  if (typeof ema20 !== "number" || typeof ema50 !== "number") {
    return {
      status: "WAIT",
      reason: "EMA data missing for options trend evaluation",
    };
  }

  let trend = "SIDEWAYS";
  if (ema20 > ema50) trend = "UPTREND";
  else if (ema20 < ema50) trend = "DOWNTREND";

  // --------------------------------------------------
  // OPTIONS NO-TRADE ZONE (LOCKED)
  // --------------------------------------------------
  if (isNoTradeZone({ spotPrice, ema20, ema50 })) {
    return {
      status: "WAIT",
      trend,
      regime: "NO_TRADE_ZONE",
      buyerAllowed: false,
      sellerAllowed: false,
      reason: "EMA compression / price noise zone",
    };
  }

  // --------------------------------------------------
  // RSI SANITY CHECK (OPTIONS)
  // --------------------------------------------------
  if (typeof rsi !== "number") {
    return {
      status: "WAIT",
      reason: "RSI data missing",
    };
  }

  const rsiExtreme = rsi >= 70 || rsi <= 30;

  // --------------------------------------------------
  // BUYER vs SELLER REGIME (FOUNDATION)
  // --------------------------------------------------
  let regime = "SIDEWAYS";
  let buyerAllowed = false;
  let sellerAllowed = false;

  // Strong trend → Buyer allowed
  if ((trend === "UPTREND" || trend === "DOWNTREND") && !rsiExtreme) {
    regime = "TRENDING";
    buyerAllowed = true;
    sellerAllowed = false;
  }

  // Sideways market → Seller allowed
  if (trend === "SIDEWAYS" && !rsiExtreme) {
    regime = "SIDEWAYS";
    buyerAllowed = false;
    sellerAllowed = true;
  }

  // High risk zone (RSI extreme / VIX spike)
  if (rsiExtreme || vix >= 18) {
    regime = "HIGH_RISK";
    buyerAllowed = false;
    sellerAllowed = false;
  }

  // --------------------------------------------------
  // FINAL OUTPUT (NO EXECUTION)
  // --------------------------------------------------
  return {
    status: "READY",
    engine: "OPTIONS_SIGNAL_ENGINE",
    symbol,
    spotPrice,
    trend,
    regime,          // TRENDING / SIDEWAYS / NO_TRADE_ZONE / HIGH_RISK
    buyerAllowed,
    sellerAllowed,
    note:
      "Options regime evaluated (buyer/seller rules applied, no execution)",
  };
}

// --------------------------------------------------
// EXPORT
// --------------------------------------------------
module.exports = {
  generateOptionsSignal,
};
