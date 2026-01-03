// ==========================================
// LONG TERM EQUITY API (PHASE-L1)
// Frontend Entry Point
// HOLD / EXIT / ACCUMULATE (TEXT ONLY)
// ==========================================

const { decideLongTermEquity } = require("./longTermDecision.service");

// ==========================================
// POST /equity/long-term
// ==========================================
function getLongTermEquity(req, res) {
  try {
    const body = req.body;

    // -----------------------------
    // BASIC INPUT CHECK
    // -----------------------------
    if (!body || typeof body !== "object") {
      return res.json({
        status: false,
        message: "Invalid long-term equity input",
      });
    }

    if (!body.symbol || !Array.isArray(body.weeklyCloses)) {
      return res.json({
        status: false,
        message: "symbol and weeklyCloses required",
      });
    }

    // -----------------------------
    // LONG TERM DECISION ENGINE
    // -----------------------------
    const result = decideLongTermEquity({
      symbol: body.symbol,
      weeklyCloses: body.weeklyCloses,
      monthlyCloses: body.monthlyCloses || [],
      holdingSince: body.holdingSince || null, // optional
      currentPrice: body.currentPrice || null,
    });

    // -----------------------------
    // FINAL RESPONSE
    // -----------------------------
    return res.json({
      status: true,
      decision: result,
    });
  } catch (e) {
    console.error("❌ Long Term Equity API Error:", e.message);

    return res.json({
      status: false,
      message: "Long-term equity processing error",
    });
  }
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  getLongTermEquity,
};
