// ==========================================
// OPTIONS API (PHASE-4 | STEP-2C FINAL)
// Single Entry Point for Options Module
// SAFETY → DECISION → RESPONSE
// NO EXECUTION | FRONTEND READY
// ==========================================

const { getOptionsContext } = require("./optionsMaster.service");
const { getOptionsSafetyContext } = require("./optionsSafety.service");
const { decideOptionTrade } = require("./optionDecision.service");

// ==========================================
// POST /options
// ==========================================
function getOptions(req, res) {
  try {
    const body = req.body;

    // -----------------------------
    // BASIC INPUT CHECK
    // -----------------------------
    if (!body || typeof body !== "object") {
      return res.json({
        status: false,
        message: "Invalid options input",
      });
    }

    if (!body.symbol || typeof body.spotPrice !== "number") {
      return res.json({
        status: false,
        message: "symbol and spotPrice required",
      });
    }

    // -----------------------------
    // STEP 1: OPTIONS MASTER CONTEXT
    // -----------------------------
    const optionsContext = getOptionsContext({
      symbol: body.symbol,
      spotPrice: body.spotPrice,
      expiryType: body.expiryType,          // WEEKLY_EXPIRY / MONTHLY_EXPIRY
      tradeContext: body.tradeContext,      // INTRADAY_OPTIONS / POSITIONAL_OPTIONS
      isResultDay: body.isResultDay === true,
      isExpiryDay: body.isExpiryDay === true,
    });

    if (optionsContext.status !== "READY") {
      return res.json({
        status: true,
        context: optionsContext,
      });
    }

    // -----------------------------
    // STEP 2: OPTIONS SAFETY CHECK (MANDATORY)
    // -----------------------------
    const safetyContext = getOptionsSafetyContext({
      symbol: optionsContext.symbol,
      expiryType: optionsContext.expiryType,
      tradeContext: optionsContext.tradeContext,
    });

    if (safetyContext.safety?.allowTrade === false) {
      return res.json({
        status: true,
        decision: {
          status: "WAIT",
          decision: "NO_TRADE",
          reason: safetyContext.safety.reason || "Options safety restriction",
          riskLevel: safetyContext.safety.riskLevel,
        },
      });
    }

    // -----------------------------
    // STEP 3: FINAL OPTIONS DECISION ENGINE
    // -----------------------------
    const finalDecision = decideOptionTrade({
      ...optionsContext,
      expiryType: optionsContext.expiryType,
      tradeContext: optionsContext.tradeContext,

      // Technical + context inputs (TEXT only usage)
      ema20: body.ema20,
      ema50: body.ema50,
      rsi: body.rsi,
      vix: body.vix,
    });

    // -----------------------------
    // FINAL API RESPONSE
    // -----------------------------
    return res.json({
      status: true,
      context: optionsContext,
      decision: finalDecision,
    });
  } catch (e) {
    console.error("❌ Options API Error:", e.message);

    return res.json({
      status: false,
      message: "Options processing error",
    });
  }
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  getOptions,
};
