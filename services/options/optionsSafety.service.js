// ==================================================
// OPTIONS SAFETY SERVICE (PHASE-4B)
// Capital + Event + Volatility Protection
// NO BUY / SELL DECISION
// ==================================================

/**
 * getOptionsSafetyContext
 * @param {object} context
 * @returns {object}
 *
 * This service ONLY decides:
 * - Trade allowed or blocked
 * - Risk level
 * - Clear reason (text)
 */
function getOptionsSafetyContext(context = {}) {
  const {
    tradeType,        // INTRADAY_OPTIONS / POSITIONAL_OPTIONS
    expiryType,       // WEEKLY_EXPIRY / MONTHLY_EXPIRY
    isExpiryDay = false,
    isResultDay = false,
    vix,              // optional number
    overnightRisk = false,
  } = context;

  // ------------------------------
  // DEFAULT SAFETY STATE
  // ------------------------------
  const safety = {
    allowTrade: true,
    riskLevel: "NORMAL",
    reason: null,
  };

  // ------------------------------
  // HARD BLOCK: RESULT DAY
  // ------------------------------
  if (isResultDay) {
    return {
      safety: {
        allowTrade: false,
        riskLevel: "HIGH",
        reason: "Option safety: result day risk",
      },
    };
  }

  // ------------------------------
  // HARD BLOCK: EXPIRY DAY
  // ------------------------------
  if (isExpiryDay) {
    return {
      safety: {
        allowTrade: false,
        riskLevel: "HIGH",
        reason: "Option safety: expiry day risk",
      },
    };
  }

  // ------------------------------
  // HIGH VIX ENVIRONMENT (SOFT BLOCK)
  // ------------------------------
  if (typeof vix === "number" && vix >= 18) {
    return {
      safety: {
        allowTrade: false,
        riskLevel: "HIGH",
        reason: "Option safety: high volatility environment",
      },
    };
  }

  // ------------------------------
  // POSITIONAL OVERNIGHT RISK
  // ------------------------------
  if (
    tradeType === "POSITIONAL_OPTIONS" &&
    overnightRisk === true
  ) {
    return {
      safety: {
        allowTrade: false,
        riskLevel: "HIGH",
        reason: "Option safety: overnight gap risk",
      },
    };
  }

  // ------------------------------
  // WEEKLY EXPIRY WARNING (NOT BLOCK)
  // ------------------------------
  if (expiryType === "WEEKLY_EXPIRY") {
    safety.riskLevel = "HIGH";
    safety.reason = "Weekly expiry: fast theta decay risk";
  }

  // ------------------------------
  // SAFE PASS
  // ------------------------------
  return {
    safety,
    note: "Options safety checks passed",
  };
}

// ==================================================
// EXPORT
// ==================================================
module.exports = {
  getOptionsSafetyContext,
};
