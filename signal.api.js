// ==========================================
// SIGNAL API – FINAL (PHASE-2A + A2 READY)
// BUY / SELL / WAIT
// ANDROID READY + SAFETY + INSTITUTIONAL
// INDEX / STOCK AWARE (INDEX MASTER WIRED)
// ==========================================

const { finalDecision } = require("./signalDecision.service");
const { getIndexConfig } = require("./indexMaster.service");

// ==========================================
// POST /signal
// ==========================================
function getSignal(req, res) {
  try {
    const body = req.body;

    // -------------------------------
    // BASIC INPUT CHECK
    // -------------------------------
    if (!body || typeof body !== "object") {
      return res.json({
        status: false,
        message: "input data missing or invalid",
      });
    }

    if (!Array.isArray(body.closes) || body.closes.length === 0) {
      return res.json({
        status: false,
        message: "closes array required",
      });
    }

    // -------------------------------
    // INSTRUMENT VALIDATION (A2)
    // -------------------------------
    const symbol = body.symbol || body.indexName;

    if (!symbol) {
      return res.json({
        status: true,
        signal: "WAIT",
        reason: "Instrument symbol missing",
      });
    }

    const indexConfig = getIndexConfig(symbol);

    if (!indexConfig) {
      return res.json({
        status: true,
        signal: "WAIT",
        reason: "Instrument not supported in this app",
      });
    }

    const segment = body.segment || "EQUITY";
    const tradeType = body.tradeType || "INTRADAY";

    if (!indexConfig.segments.includes(segment)) {
      return res.json({
        status: true,
        signal: "WAIT",
        reason: `Segment ${segment} not allowed for ${symbol}`,
      });
    }

    if (
      tradeType &&
      indexConfig.allowedTradeTypes &&
      !indexConfig.allowedTradeTypes.includes(tradeType)
    ) {
      return res.json({
        status: true,
        signal: "WAIT",
        reason: `Trade type ${tradeType} not allowed for ${symbol}`,
      });
    }

    // -------------------------------
    // NORMALIZED DATA (ENGINE INPUT)
    // -------------------------------
    const data = {
      // ===== INSTRUMENT CONTEXT =====
      symbol,
      instrumentType: indexConfig.instrumentType,
      segment,

      // ===== PRICE / TECHNICAL =====
      closes: body.closes,
      ema20: body.ema20 || [],
      ema50: body.ema50 || [],
      rsi: body.rsi,
      close: body.close,
      support: body.support,
      resistance: body.resistance,
      volume: body.volume,
      avgVolume: body.avgVolume,

      // ===== INSTITUTIONAL =====
      oiData: Array.isArray(body.oiData) ? body.oiData : [],
      pcrValue:
        typeof body.pcrValue === "number" ? body.pcrValue : null,

      // ===== SAFETY CONTEXT =====
      isResultDay: body.isResultDay === true,
      isExpiryDay: body.isExpiryDay === true,
      tradeCountToday: Number(body.tradeCountToday || 0),
      tradeType,

      // ===== VIX (TEXT ONLY) =====
      vix: typeof body.vix === "number" ? body.vix : null,
    };

    // -------------------------------
    // FINAL DECISION ENGINE
    // -------------------------------
    const result = finalDecision(data);

    // -------------------------------
    // VIX NOTE (DISPLAY ONLY)
    // -------------------------------
    let vixNote = null;

    if (typeof data.vix === "number") {
      if (data.vix >= 18) {
        vixNote =
          "High volatility (VIX elevated) – reduce position size & expect fast moves";
      } else if (data.vix <= 12) {
        vixNote =
          "Low volatility (VIX calm) – breakout follow-through may be slow";
      } else {
        vixNote = "Normal volatility conditions";
      }
    }

    return res.json({
      status: true,

      // ===== CONTEXT =====
      symbol,
      instrumentType: indexConfig.instrumentType,
      exchange: indexConfig.exchange,
      segment,

      // ===== SIGNAL =====
      signal: result.signal,        // BUY / SELL / WAIT
      trend: result.trend || null,
      reason: result.reason,
      vixNote,
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
