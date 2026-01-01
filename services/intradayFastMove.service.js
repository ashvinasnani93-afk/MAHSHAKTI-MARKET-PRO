// ==========================================
// INTRADAY FAST-MOVE ENGINE (PHASE-2B)
// REAL, RULE-LOCKED
// BUY / SELL / HOLD / WAIT
// ==========================================

/**
 * detectFastMove
 * @param {object} data
 * @returns {object}
 *
 * Required data:
 * - ltp
 * - prevLtp
 * - volume
 * - avgVolume
 * - trend (UPTREND / DOWNTREND)
 * - isExpiryDay
 * - isResultDay
 */
function detectFastMove(data = {}) {
  const {
    ltp,
    prevLtp,
    volume,
    avgVolume,
    trend,
    isExpiryDay = false,
    isResultDay = false,
  } = data;

  // -------------------------------
  // HARD SAFETY – INPUT
  // -------------------------------
  if (
    typeof ltp !== "number" ||
    typeof prevLtp !== "number" ||
    typeof volume !== "number" ||
    typeof avgVolume !== "number"
  ) {
    return {
      signal: "WAIT",
      reason: "Fast-move: insufficient data",
    };
  }

  // -------------------------------
  // TREND SAFETY
  // -------------------------------
  if (trend !== "UPTREND" && trend !== "DOWNTREND") {
    return {
      signal: "WAIT",
      reason: "Fast-move blocked: trend not clear",
    };
  }

  // -------------------------------
  // RESULT / EXPIRY BLOCK (LOCKED)
  // -------------------------------
  if (isResultDay) {
    return {
      signal: "WAIT",
      reason: "Fast-move blocked on result day",
    };
  }

  if (isExpiryDay) {
    return {
      signal: "WAIT",
      reason: "Fast-move blocked on expiry day",
    };
  }

  // -------------------------------
  // PRICE CHANGE %
  // -------------------------------
  const changePercent = ((ltp - prevLtp) / prevLtp) * 100;
  const absChange = Math.abs(changePercent);

  // -------------------------------
  // EXTREME SPIKE SAFETY
  // -------------------------------
  if (absChange > 1.8) {
    return {
      signal: "HOLD",
      reason: "Extreme spike detected – capital protection mode",
      mode: "FAST_MOVE",
    };
  }

  // -------------------------------
  // FAST MOVE CONDITIONS
  // -------------------------------
  const priceBurst = absChange >= 0.35; // sudden move
  const volumeBurst = volume >= avgVolume * 1.5;

  if (!priceBurst || !volumeBurst) {
    return {
      signal: "WAIT",
      reason: "No intraday fast-move confirmation",
    };
  }

  // -------------------------------
  // DIRECTIONAL LOGIC
  // -------------------------------
  if (changePercent > 0 && trend === "UPTREND") {
    return {
      signal: "BUY",
      reason: "Intraday fast bullish move with volume confirmation",
      mode: "FAST_MOVE",
    };
  }

  if (changePercent < 0 && trend === "DOWNTREND") {
    return {
      signal: "SELL",
      reason: "Intraday fast bearish move with volume confirmation",
      mode: "FAST_MOVE",
    };
  }

  // -------------------------------
  // MISALIGNED MOVE
  // -------------------------------
  return {
    signal: "HOLD",
    reason: "Fast move detected but higher trend misaligned",
    mode: "FAST_MOVE",
  };
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  detectFastMove,
};
