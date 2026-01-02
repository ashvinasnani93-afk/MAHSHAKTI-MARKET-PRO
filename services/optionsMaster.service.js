// ==========================================
// OPTIONS MASTER SERVICE (PHASE-3)
// Central controller for Options logic
// NIFTY / BANKNIFTY / STOCK OPTIONS
// ==========================================

const { getOptionsSafetyContext } = require("./options/optionsSafety.service");
const { createPaperTrade } = require("./optionsPaperTrade.service");
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
// PAPER TRADE CONTEXT (NO EXECUTION)
// -----------------------------
const paperTradePreview = createPaperTrade({
  symbol,
  optionType: "CE",        // abhi fixed, next step me dynamic hoga
  entryPrice: spotPrice,
  quantity: 1,
  signal: "BUY",
});


return {
  status: "READY",
  symbol,
  spotPrice,
  expiryType,
  tradeContext,
  safety: safetyContext.safety,
  paperTradePreview,
  note: "Options master + safety + paper trade preview ready",
};
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  getOptionsContext,
};
