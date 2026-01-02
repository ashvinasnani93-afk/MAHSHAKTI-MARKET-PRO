// ==================================================
// OPTIONS SIGNAL ENGINE (PHASE-3)
// CORE BRAIN – RULE LOCKED
// NO DUMMY | NO SHORTCUT
// ==================================================

/**
 * generateOptionsSignal
 * @param {object} context
 * @returns {object}
 *
 * Context comes ONLY from optionsMaster.service
 * No direct market / API calls here
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
    rsi, // ✅ RSI added
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

  // Expiry day = no fresh options signal
  if (safety.isExpiryDay) {
    return {
      status: "WAIT",
      reason: "Blocked by expiry-day safety rule",
    };
  }

  // Intraday trade blocked if not allowed
  if (
    tradeContext === "INTRADAY_OPTIONS" &&
    !safety.intradayAllowed
  ) {
    return {
      status: "WAIT",
      reason: "Intraday options not allowed by safety layer",
    };
  }

  // Positional trade blocked if not allowed
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
  // TREND CHECK (EMA 20 / EMA 50) – LOCKED
  // --------------------------------------------------
  if (typeof ema20 !== "number" || typeof ema50 !== "number") {
    return {
      status: "WAIT",
      reason: "EMA data missing for options trend evaluation",
    };
  }

  let trend = "SIDEWAYS";
  if (ema20 > ema50) {
    trend = "UPTREND";
  } else if (ema20 < ema50) {
    trend = "DOWNTREND";
  }

  // --------------------------------------------------
  // RSI SANITY CHECK (OPTIONS) – LOCKED
  // --------------------------------------------------
  if (typeof rsi !== "number") {
    return {
      status: "WAIT",
      reason: "RSI data missing",
    };
  }

  // Overbought zone
  if (rsi >= 70) {
    return {
      status: "WAIT",
      reason: "RSI overbought – no fresh options entry",
    };
  }

  // Oversold zone
  if (rsi <= 30) {
    return {
      status: "WAIT",
      reason: "RSI oversold – no fresh options entry",
    };
  }

  // --------------------------------------------------
  // FINAL ENGINE OUTPUT (NO BUY / SELL)
  // --------------------------------------------------
  return {
    status: "WAIT",
    engine: "OPTIONS_SIGNAL_ENGINE",
    trend,
    rsiStatus: "NORMAL",
    note: "EMA trend + RSI sanity evaluated. Signal rules locked (no execution).",
  };
}

// --------------------------------------------------
// EXPORT
// --------------------------------------------------
module.exports = {
  generateOptionsSignal,
};
