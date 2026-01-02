// ==========================================
// OPTIONS API (PHASE-3)
// Entry point for Options module
// NO SIGNAL – Context + Safety + Paper Trade Preview
// ==========================================

const { getOptionsContext } = require("./optionsMaster.service");

// ==========================================
// POST /options/context
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

    // -----------------------------
    // OPTIONS CONTEXT ENGINE
    // -----------------------------
    const result = getOptionsContext({
      symbol: body.symbol,
      spotPrice: body.spotPrice,
      expiry: body.expiry,           // WEEKLY / MONTHLY
      tradeType: body.tradeType,     // INTRADAY / POSITIONAL
    });

    return res.json({
      status: true,
      data: result,
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
