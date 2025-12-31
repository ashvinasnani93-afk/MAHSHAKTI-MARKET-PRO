// ==========================================
// SIGNAL ENGINE – CORE CHECKS ONLY
// Trend / RSI / Breakout / Volume
// ==========================================

// ==========================================
// STEP 1 – TREND CHECK
// EMA 20 / EMA 50
// ==========================================

function checkTrend({ closes = [], ema20 = [], ema50 = [] }) {
  if (!closes.length || !ema20.length || !ema50.length) {
    return {
      trend: "NO_TRADE",
      reason: "insufficient data",
    };
  }

  const price = closes[closes.length - 1];
  const e20 = ema20[ema20.length - 1];
  const e50 = ema50[ema50.length - 1];

  if (price > e20 && e20 > e50) {
    return {
      trend: "UPTREND",
      reason: "price > EMA20 > EMA50",
    };
  }

  if (price < e20 && e20 < e50) {
    return {
      trend: "DOWNTREND",
      reason: "price < EMA20 < EMA50",
    };
  }

  return {
    trend: "NO_TRADE",
    reason: "EMA compression / sideways",
  };
}

// ==========================================
// STEP 2 – RSI SANITY CHECK
// ==========================================

function checkRSI({ rsi, trend }) {
  if (typeof rsi !== "number") {
    return {
      allowed: false,
      reason: "RSI missing",
    };
  }

  if (trend === "UPTREND" && rsi >= 70) {
    return {
      allowed: false,
      reason: "RSI overbought",
    };
  }

  if (trend === "DOWNTREND" && rsi <= 30) {
    return {
      allowed: false,
      reason: "RSI oversold",
    };
  }

  return {
    allowed: true,
    reason: "RSI OK",
  };
}

// ==========================================
// STEP 3 – BREAKOUT / BREAKDOWN
// CLOSE BASED CONFIRMATION
// ==========================================

function checkBreakout({ close, support, resistance, trend }) {
  if (
    typeof close !== "number" ||
    typeof support !== "number" ||
    typeof resistance !== "number"
  ) {
    return {
      allowed: false,
      reason: "levels missing",
    };
  }

  if (trend === "UPTREND" && close > resistance) {
    return {
      allowed: true,
      action: "BUY",
      reason: "bullish breakout",
    };
  }

  if (trend === "DOWNTREND" && close < support) {
    return {
      allowed: true,
      action: "SELL",
      reason: "bearish breakdown",
    };
  }

  return {
    allowed: false,
    reason: "no breakout confirmation",
  };
}

// ==========================================
// STEP 4 – VOLUME CONFIRMATION
// FAKE BREAKOUT GUARD
// ==========================================

function checkVolume({ volume, avgVolume }) {
  if (typeof volume !== "number" || typeof avgVolume !== "number") {
    return {
      allowed: false,
      reason: "volume data missing",
    };
  }

  if (volume > avgVolume) {
    return {
      allowed: true,
      reason: "volume confirmation OK",
    };
  }

  return {
    allowed: false,
    reason: "low volume – fake breakout risk",
  };
}

// ==========================================
// EXPORTS (ONLY CHECKS – NO FINAL DECISION)
// ==========================================

module.exports = {
  checkTrend,
  checkRSI,
  checkBreakout,
  checkVolume,
};
