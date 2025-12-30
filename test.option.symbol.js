// ==========================================
// OPTION SYMBOL GENERATOR TEST
// NIFTY / BANKNIFTY
// ==========================================

const {
  generateIndexOptionSymbol
} = require("./symbol.service");

// -------------------------------
// TEST CASES
// -------------------------------

console.log("=== OPTION SYMBOL TEST START ===");

// Example inputs
const tests = [
  {
    index: "NIFTY",
    expiry: "WEEKLY",
    strike: 22500,
    type: "CE",
    date: new Date("2025-01-02")
  },
  {
    index: "NIFTY",
    expiry: "MONTHLY",
    strike: 22600,
    type: "PE",
    date: new Date("2025-01-30")
  },
  {
    index: "BANKNIFTY",
    expiry: "WEEKLY",
    strike: 48200,
    type: "CE",
    date: new Date("2025-01-02")
  }
];

// Run tests
tests.forEach((t, i) => {
  const symbol = generateIndexOptionSymbol(
    t.index,
    t.date,
    t.strike,
    t.type,
    t.expiry
  );

  console.log(`Test ${i + 1}:`, symbol);
});

console.log("=== OPTION SYMBOL TEST END ===");
