// ==========================================
// GREEKS SERVICE – INSTITUTIONAL CONTEXT
// PHASE-2A (SIMPLIFIED, TEXT ONLY)
// ==========================================

/**
 * getGreeksContext
 * @param {object} greeks
 * Expected:
 * {
 *   delta,
 *   gamma,
 *   theta,
 *   vega
 * }
 */
function getGreeksContext(greeks = {}) {
  if (!greeks || typeof greeks !== "object") {
    return {
      bias: "NEUTRAL",
      note: "Greeks data not available",
    };
  }

  const { delta, gamma, theta, vega } = greeks;

  // -----------------------------
  // BUYER CONTEXT
  // -----------------------------
  if (typeof delta === "number" && delta > 0.6) {
    return {
      bias: "BUYER_FAVORABLE",
      note: "High delta suggests strong directional momentum",
    };
  }

  // -----------------------------
  // SELLER CONTEXT
  // -----------------------------
  if (typeof theta === "number" && theta < 0) {
    return {
      bias: "SELLER_FAVORABLE",
      note: "Theta decay dominant – favors option sellers",
    };
  }

  // -----------------------------
  // HIGH RISK CONTEXT
  // -----------------------------
  if (typeof gamma === "number" && gamma > 0.15) {
    return {
      bias: "HIGH_RISK",
      note: "High gamma – rapid price sensitivity, caution advised",
    };
  }

  // -----------------------------
  // DEFAULT
  // -----------------------------
  return {
    bias: "NEUTRAL",
    note: "Greeks balanced – no strong institutional edge",
  };
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  getGreeksContext,
};
