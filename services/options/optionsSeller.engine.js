// ==================================================
// OPTIONS SELLER ENGINE (PHASE-4.2)
// RANGE / SIDEWAYS MARKET – SELL DECISION ONLY
// NO EXECUTION | RULE LOCKED
// ==================================================

/**
 * evaluateSellerContext
 * @param {object} context
 * @returns {object}
 *
 * Input comes from optionsSignal.engine
 */
function evaluateSellerContext(context = {}) {
  const {
    trend,        // UPTREND / DOWNTREND / SIDEWAYS
    rsi,
    safety,
  } = context;

  // ----------------------------------
  // HARD SAFETY
  // ----------------------------------
  if (!safety) {
    return {
      sellerAllowed: false,
      reason: "Safety context missing",
    };
  }

  // Expiry / Event day = no selling
  if (safety.isExpiryDay) {
    return {
      sellerAllowed: false,
      reason: "Option selling blocked on expiry day",
    };
  }

  // ----------------------------------
  // MARKET REGIME CHECK
  // ----------------------------------
  if (trend !== "SIDEWAYS") {
    return {
      sellerAllowed: false,
      reason: "Market not sideways – option selling avoided",
    };
  }

  // ----------------------------------
  // RSI FILTER (SELLER SAFETY)
  // ----------------------------------
  if (typeof rsi !== "number") {
    return {
      sellerAllowed: false,
      reason: "RSI data missing for seller decision",
    };
  }

  // Extreme RSI = avoid selling
  if (rsi > 65 || rsi < 35) {
    return {
      sellerAllowed: false,
      reason: "RSI extreme – unsafe for option selling",
    };
  }

  // ----------------------------------
  // ✅ SELL ALLOWED
  // ----------------------------------
  return {
    sellerAllowed: true,
    strategy: "RANGE_OPTION_SELL",
    note: "Sideways market + stable RSI – option selling allowed",
  };
}

// ----------------------------------
// EXPORT
// ----------------------------------
module.exports = {
  evaluateSellerContext,
};
