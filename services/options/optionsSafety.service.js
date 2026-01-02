// ==================================================
// OPTIONS SAFETY SERVICE (PHASE-3)
// Capital Protection Layer (NO SIGNAL)
// ==================================================

/**
 * getOptionsSafetyContext
 * @param {object} data
 * @returns {object}
 */
function getOptionsSafetyContext(data = {}) {
  const {
    expiryType,
    tradeContext,
  } = data;

  // ------------------------------
  // SAFETY FLAGS
  // ------------------------------
  const safety = {
    isExpiryDay: expiryType === "EXPIRY_DAY",
    isWeeklyExpiry: expiryType === "WEEKLY_EXPIRY",
    isMonthlyExpiry: expiryType === "MONTHLY_EXPIRY",

    intradayAllowed: tradeContext === "INTRADAY_OPTIONS",
    positionalAllowed: tradeContext === "POSITIONAL_OPTIONS",
  };

  // ------------------------------
  // FINAL SAFETY CONTEXT
  // ------------------------------
  return {
    status: "SAFE_CHECK_READY",
    safety,
    note: "Safety context prepared (no trade decision)",
  };
}

// ------------------------------
// EXPORT
// ------------------------------
module.exports = {
  getOptionsSafetyContext,
};
