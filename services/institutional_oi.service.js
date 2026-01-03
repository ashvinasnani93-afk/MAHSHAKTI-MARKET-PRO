// ==========================================
// OI SERVICE – INSTITUTIONAL ANALYSIS (PHASE-2A)
// Used by Signal Decision Engine
// ==========================================

/**
 * detectBuildup
 * Agar Angel se raw OI data aaye (oiChange + priceChange)
 */
function detectBuildup(item = {}) {
  const oiChange = Number(item.oiChange || 0);
  const priceChange = Number(item.priceChange || 0);

  if (oiChange > 0 && priceChange > 0) return "LONG_BUILDUP";
  if (oiChange > 0 && priceChange < 0) return "SHORT_BUILDUP";
  if (oiChange < 0 && priceChange > 0) return "SHORT_COVERING";
  if (oiChange < 0 && priceChange < 0) return "LONG_UNWINDING";

  return "NEUTRAL";
}

/**
 * summarizeOI
 * @param {Array} oiData
 * Supports BOTH:
 * 1️⃣ { buildup: "LONG_BUILDUP" }
 * 2️⃣ { oiChange, priceChange }  ← Angel real data
 */
function summarizeOI(oiData = []) {
  let longBuildUp = 0;
  let shortBuildUp = 0;
  let shortCovering = 0;
  let longUnwinding = 0;

  oiData.forEach((item) => {
    const buildup = item.buildup || detectBuildup(item);

    switch (buildup) {
      case "LONG_BUILDUP":
        longBuildUp++;
        break;
      case "SHORT_BUILDUP":
        shortBuildUp++;
        break;
      case "SHORT_COVERING":
        shortCovering++;
        break;
      case "LONG_UNWINDING":
        longUnwinding++;
        break;
    }
  });

  // Institutional Bias Logic
  if (longBuildUp + shortCovering > shortBuildUp + longUnwinding) {
    return {
      bias: "BULLISH",
      note: "Institutional long buildup / short covering dominance",
    };
  }

  if (shortBuildUp + longUnwinding > longBuildUp + shortCovering) {
    return {
      bias: "BEARISH",
      note: "Institutional short buildup / long unwinding dominance",
    };
  }

  return {
    bias: "NEUTRAL",
    note: "Institutional activity balanced",
  };
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  summarizeOI,
};
