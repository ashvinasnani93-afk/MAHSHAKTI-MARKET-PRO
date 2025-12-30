// ==========================================
// OPTION LTP SERVICE (NFO WebSocket)
// ==========================================

let optionLTP = {};

// ===============================
// UPDATE LTP FROM WS
// ===============================
function updateOptionLTP(token, ltp) {
  optionLTP[token] = ltp;
}

// ===============================
// GET LTP
// ===============================
function getOptionLTP(token) {
  return optionLTP[token] || null;
}

// ===============================
// EXPORT
// ===============================
module.exports = {
  updateOptionLTP,
  getOptionLTP,
};
