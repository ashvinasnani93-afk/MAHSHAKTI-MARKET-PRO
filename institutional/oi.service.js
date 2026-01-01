// ==========================================
// OI SERVICE – INSTITUTIONAL ANALYSIS (PHASE-2A)
// Used by Signal Decision Engine
// ==========================================

/**
 * summarizeOI
 * @param {Array} oiData
 * Each item example:
 * { buildup: "LONG_BUILDUP" | "SHORT_BUILDUP" | "SHORT_COVERING" | "LONG_UNWINDING" }
 */
function summarizeOI(oiData = []) {
  let longBuildUp = 0;
  let shortBuildUp = 0;
  let shortCovering = 0;
  let longUnwinding = 0;

  oiData.forEach((item) => {
    switch (item.buildup) {
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
