// ==========================================
// SIGNAL SAFETY SERVICE – PHASE 1
// FINAL SAFETY + CONTEXT LAYER
// ==========================================

/**
 * applySafety
 * @param {object} signalResult  // BUY / SELL / WAIT from signalDecision
 * @param {object} context       // market & user context
 * @returns {object}             // FINAL SAFE SIGNAL
 */
function applySafety(signalResult, context = {}) {
  // -------------------------------
  // DEFAULT CONTEXT (TEMP)
  // -------------------------------
  const {
    isResultDay = false,
    isExpiryDay = false,
    tradeCountToday = 0,
    tradeType = "INTRADAY", // EQUITY / INTRADAY
  } = context;

  // -------------------------------
  // RESULT DAY SAFETY
  // -------------------------------
  if (isResultDay && signalResult.signal !== "WAIT") {
    return {
      signal: "WAIT",
      reason: "Result day safety – trade blocked",
    };
  }

  // -------------------------------
  // EXPIRY DAY SAFETY
  // -------------------------------
  if (isExpiryDay && signalResult.signal !== "WAIT") {
    return {
      signal: "WAIT",
      reason: "Expiry day safety – trade blocked",
    };
  }

  // -------------------------------
  // OVERTRADE GUARD
  // -------------------------------
  if (tradeCountToday >= 3 && signalResult.signal !== "WAIT") {
    return {
      signal: "WAIT",
      reason: "Overtrade guard – trade limit reached",
    };
  }

  // -------------------------------
  // PASS THROUGH (SAFE)
  // -------------------------------
  return signalResult;
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  applySafety,
};
