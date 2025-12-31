// ==========================================
// SIGNAL API – ANDROID READY
// BUY / SELL / WAIT
// ==========================================

const { finalDecision } = require("./signalDecision.service");

// ==========================================
// GET SIGNAL
// /signal
// ==========================================
function getSignal(req, res) {
  try {
    const data = req.body;

    if (!data) {
      return res.json({
        status: false,
        message: "input data missing",
      });
    }

    const result = finalDecision(data);

    return res.json({
      status: true,
      signal: result.signal,
      trend: result.trend || null,
      reason: result.reason,
    });
  } catch (e) {
    console.error("❌ Signal API Error:", e.message);
    return res.json({
      status: false,
      message: "signal processing error",
    });
  }
}

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  getSignal,
};
