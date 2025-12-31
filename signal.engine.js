// ==========================================
// SIGNAL ENGINE – STEP 1 (TREND CHECK)
// EMA 20 / EMA 50
// ==========================================

/**
 * checkTrend
 * @param {number[]} closes - candle close prices (latest last)
 * @param {number[]} ema20  - EMA 20 values (latest last)
 * @param {number[]} ema50  - EMA 50 values (latest last)
 * @returns {object}
 */
function checkTrend({ closes = [], ema20 = [], ema50 = [] }) {
  if (
    closes.length === 0 ||
    ema20.length === 0 ||
    ema50.length === 0
  ) {
    return {
      trend: "NO_TRADE",
      reason: "insufficient data",
    };
  }

  const price = closes[closes.length - 1];
  const e20 = ema20[ema20.length - 1];
  const e50 = ema50[ema50.length - 1];

  // 📈 UPTREND
  if (price > e20 && e20 > e50) {
    return {
      trend: "UPTREND",
      reason: "price > EMA20 > EMA50",
    };
  }

  // 📉 DOWNTREND
  if (price < e20 && e20 < e50) {
    return {
      trend: "DOWNTREND",
      reason: "price < EMA20 < EMA50",
    };
  }

  // ⛔ NO TRADE ZONE
  return {
    trend: "NO_TRADE",
    reason: "EMA compression / sideways",
  };
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  checkTrend,
};
