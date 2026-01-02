// ==================================================
// OPTIONS SAFETY SERVICE (PHASE-4)
// Capital & Behaviour Protection Layer (NO SIGNAL)
// ==================================================

/**
 * getOptionsSafetyContext
 * @param {object} context
 * @returns {object}
 */
function getOptionsSafetyContext(context = {}) {
  const {
    symbol,
    expiryType,
    tradeContext,
  } = context;

  // ------------------------------
  // DEFAULT SAFETY OBJECT
  // ------------------------------
  const safety = {
    allowTrade: true,
    riskLevel: "NORMAL",
    reason: null,
  };

  // ------------------------------
  // WEEKLY / EXPIRY DAY RISK
  // ------------------------------
  if (expiryType === "WEEKLY_EXPIRY") {
    safety.riskLevel = "HIGH";
  }

  // ------------------------------
  // POSITIONAL OPTIONS RISK
  // ------------------------------
  if (tradeContext === "POSITIONAL_OPTIONS") {
    safety.riskLevel = "HIGH";
  }

  // ------------------------------
  // FINAL SAFETY CONTEXT
  // ------------------------------
  return {
    ...context,
    safety,
    note: "Options safety context prepared (no trade decision)",
  };
}

// ------------------------------
// EXPORT
// ------------------------------
module.exports = {
  getOptionsSafetyContext,
};// ==================================================
// OPTIONS SAFETY SERVICE (PHASE-4)
// Capital & Behaviour Protection Layer (NO SIGNAL)
// ==================================================

/**
 * getOptionsSafetyContext
 * @param {object} context
 * @returns {object}
 */
function getOptionsSafetyContext(context = {}) {
  const {
    symbol,
    expiryType,
    tradeContext,
  } = context;

  // ------------------------------
  // DEFAULT SAFETY OBJECT
  // ------------------------------
  const safety = {
    allowTrade: true,
    riskLevel: "NORMAL",
    reason: null,
  };

  // ------------------------------
  // WEEKLY / EXPIRY DAY RISK
  // ------------------------------
  if (expiryType === "WEEKLY_EXPIRY") {
    safety.riskLevel = "HIGH";
  }

  // ------------------------------
  // POSITIONAL OPTIONS RISK
  // ------------------------------
  if (tradeContext === "POSITIONAL_OPTIONS") {
    safety.riskLevel = "HIGH";
  }

  // ------------------------------
  // FINAL SAFETY CONTEXT
  // ------------------------------
  return {
    ...context,
    safety,
    note: "Options safety context prepared (no trade decision)",
  };
}

// ------------------------------
// EXPORT
// ------------------------------
module.exports = {
  getOptionsSafetyContext,
};
