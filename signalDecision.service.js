// ==========================================
// SIGNAL DECISION SERVICE – STEP 4.6
// FINAL BUY / SELL / WAIT DECISION
// ==========================================

/**
 * finalDecision
 * @param {object} trendResult
 * @param {object} rsiResult
 * @param {object} breakoutResult
 * @param {object} volumeResult
 * @returns {object}
 */
function finalDecision({
  trendResult,
  rsiResult,
  breakoutResult,
  volumeResult,
}) {
  // ❌ Trend fail
  if (!trendResult || trendResult.trend === "NO_TRADE") {
    return {
      signal: "WAIT",
      reason: "trend not clear",
    };
  }

  // ❌ RSI blocked
  if (!rsiResult || rsiResult.allowed !== true) {
    return {
      signal: "WAIT",
      reason: rsiResult?.reason || "RSI blocked",
    };
  }

  // ❌ Breakout not confirmed
  if (!breakoutResult || breakoutResult.allowed !== true) {
    return {
      signal: "WAIT",
      reason: breakoutResult?.reason || "no breakout",
    };
  }

  // ❌ Volume weak
  if (!volumeResult || volumeResult.allowed !== true) {
    return {
      signal: "WAIT",
      reason: volumeResult?.reason || "volume not confirmed",
    };
  }

  // ✅ FINAL SIGNAL
  return {
    signal: breakoutResult.action, // BUY or SELL
    reason: "all conditions satisfied",
  };
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  finalDecision,
};
