// ==================================================
// OPTION DECISION SERVICE (PHASE-4)
// FINAL OPTIONS DECISION BRAIN
// Buyer vs Seller | Strike Logic | Risk Context
// NO EXECUTION | RULE-LOCKED
// ==================================================

const { generateOptionsSignal } = require("./optionsSignal.engine");

/**
 * decideOptionTrade
 * @param {object} data
 * @returns {object}
 *
 * This service:
 * - Takes final context
 * - Decides BUY / SELL / WAIT (text only)
 * - Gives clear reason (explainable)
 */
function decideOptionTrade(data = {}) {
  // ----------------------------------
  // HARD INPUT CHECK
  // ----------------------------------
  if (!data || typeof data !== "object") {
    return {
      status: "WAIT",
      decision: "NO_TRADE",
      reason: "Invalid options decision input",
    };
  }

  // ----------------------------------
  // STEP 1: CORE SIGNAL ENGINE
  // ----------------------------------
  const signalContext = generateOptionsSignal(data);

  if (!signalContext || signalContext.status !== "READY") {
    return {
      status: "WAIT",
      decision: "NO_TRADE",
      reason: signalContext?.reason || "Options signal not ready",
    };
  }

  const {
    buyerAllowed,
    sellerAllowed,
    trend,
    regime,
    buyerReason,
    sellerReason,
    sellerStrategy,
  } = signalContext;

  // ----------------------------------
  // STEP 2: BUYER DECISION
  // ----------------------------------
  if (buyerAllowed) {
    return {
      status: "OK",
      decision: "OPTION_BUY_ALLOWED",
      mode: "BUYER",
      trend,
      regime,
      reason: buyerReason || "Buyer conditions satisfied",
      note: "Options BUY allowed (execution handled elsewhere)",
    };
  }

  // ----------------------------------
  // STEP 3: SELLER DECISION
  // ----------------------------------
  if (sellerAllowed) {
    return {
      status: "OK",
      decision: "OPTION_SELL_ALLOWED",
      mode: "SELLER",
      trend,
      regime,
      strategy: sellerStrategy || "RANGE_SELL",
      reason: sellerReason || "Seller conditions satisfied",
      note: "Options SELL allowed (execution handled elsewhere)",
    };
  }

  // ----------------------------------
  // STEP 4: NO TRADE
  // ----------------------------------
  return {
    status: "WAIT",
    decision: "NO_TRADE",
    trend,
    regime,
    reason: "Neither buyer nor seller conditions satisfied",
  };
}

// ==================================================
// EXPORT
// ==================================================
module.exports = {
  decideOptionTrade,
};
