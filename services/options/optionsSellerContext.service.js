// ==================================================
// OPTIONS SELLER CONTEXT SERVICE (PHASE-3)
// SELLER LOGIC – RULE LOCKED
// NO EXECUTION | NO DUMMY
// ==================================================

/**
 * getOptionsSellerContext
 * @param {object} data
 * @returns {object}
 *
 * Expected input:
 * - regime
 * - trend
 * - safety
 * - expiryType
 */
function getOptionsSellerContext(data = {}) {
  const {
    regime,
    trend,
    safety,
    expiryType,
  } = data;

  // ------------------------------
  // HARD SAFETY
  // ------------------------------
  if (!regime || !safety || !expiryType) {
    return {
      sellerAllowed: false,
      sellerType: "NONE",
      reason: "Incomplete seller context data",
    };
  }

  // ------------------------------
  // GLOBAL BLOCKS (LOCKED)
  // ------------------------------
  if (safety.isExpiryDay || safety.isResultDay) {
    return {
      sellerAllowed: false,
      sellerType: "NONE",
      reason: "Seller blocked on result / expiry day",
    };
  }

  if (regime === "HIGH_RISK") {
    return {
      sellerAllowed: false,
      sellerType: "NONE",
      reason: "High risk regime – seller blocked",
    };
  }

  if (regime === "NO_TRADE_ZONE") {
    return {
      sellerAllowed: false,
      sellerType: "NONE",
      reason: "No-trade zone – seller blocked",
    };
  }

  // ------------------------------
  // STRONG TREND = SELLER AVOID
  // ------------------------------
  if (regime === "TRENDING") {
    return {
      sellerAllowed: false,
      sellerType: "NONE",
      reason: "Strong trend – option selling avoided",
    };
  }

  // ------------------------------
  // SIDEWAYS MARKET = SELLER ALLOWED
  // ------------------------------
  if (regime === "SIDEWAYS") {
    return {
      sellerAllowed: true,
      sellerType:
        expiryType === "MONTHLY_EXPIRY"
          ? "MONTHLY_STRANGLE"
          : "WEEKLY_PREMIUM_SELL",
      reason: "Sideways market – option selling allowed",
    };
  }

  // ------------------------------
  // DEFAULT FALLBACK
  // ------------------------------
  return {
    sellerAllowed: false,
    sellerType: "NONE",
    reason: "Seller conditions not satisfied",
  };
}

// --------------------------------------------------
// EXPORT
// --------------------------------------------------
module.exports = {
  getOptionsSellerContext,
};
