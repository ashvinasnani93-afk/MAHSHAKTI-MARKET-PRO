// ==========================================
// OPTIONS MASTER SERVICE (PHASE-3)
// Central controller for Options logic
// NIFTY / BANKNIFTY / STOCK OPTIONS
// ==========================================

const { getOptionsSafetyContext } = require("./options/optionsSafety.service");
// ⚠️ Paper trade service ABHI import nahi karna
// ⚠️ Execution layer baad me connect hoga (locked design)

/**
 * getOptionsContext
 * @param {object} data
 * @returns {object}
 */
function getOptionsContext(data = {}) {
  const {
    symbol,
    spotPrice,
    expiry,
    tradeType,
  } = data;

  // -----------------------------
  // HARD SAFETY CHECK
  // -----------------------------
  if (!symbol || !spotPrice || !expiry || !tradeType) {
    return {
      status: "WAIT",
      reason: "Insufficient options input data",
    };
  }

  // -----------------------------
  // EXPIRY CONTEXT
  // -----------------------------
  const expiryType =
    expiry === "WEEKLY"
      ? "WEEKLY_EXPIRY"
      : expiry === "MONTHLY"
      ? "MONTHLY_EXPIRY"
      : "UNKNOWN_EXPIRY";

  // -----------------------------
  // TRADE TYPE CONTEXT
  // -----------------------------
  const tradeContext =
    tradeType === "INTRADAY"
      ? "INTRADAY_OPTIONS"
      : "POSITIONAL_OPTIONS";

  // -----------------------------
  // SAFETY CONTEXT (NO SIGNAL)
  // -----------------------------
  const safetyContext = getOptionsSafetyContext({
    expiryType,
    tradeContext,
  });

  // -----------------------------
  // FINAL OPTIONS CONTEXT
  // (NO BUY / SELL / PAPER EXECUTION)
  // -----------------------------
  return {
    status: "READY",
    symbol,
    spotPrice,
    expiryType,
    tradeContext,
    safety: safetyContext.safety,
    note: "Options master + safety context ready (no signal, no execution)",
  };
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  getOptionsContext,
};
