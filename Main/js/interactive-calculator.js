/**
 * DCSimulator - Interactive Dividend & Tax Capital Calculator
 * Calculates after-tax net yield and required capital based on target income,
 * US withholding tax, local country tax rates, and fund expense ratios (TER).
 */

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("dividend-calculator-widget");
  if (!container) return;

  // Preset Country Tax Rates
  const countryTaxRates = {
    IT: { name: "Italy (26% Tax)", rate: 26 },
    ES: { name: "Spain (19% Base Tax)", rate: 19 },
    UK: { name: "United Kingdom (8.75% Basic Tax)", rate: 8.75 },
    FR: { name: "France (30% PFU Flat Tax)", rate: 30 },
    NL: { name: "Netherlands (15% Dividend Tax)", rate: 15 },
    DE: { name: "Germany (26.375% Abgeltungsteuer)", rate: 26.375 },
    US: { name: "United States (15% Qualified)", rate: 15 },
    CUSTOM: { name: "Custom Tax Rate", rate: 20 }
  };

  // Render Widget HTML
  container.innerHTML = `
    <div class="calc-widget-container">
      <div class="calc-widget-header">
        <h3>⚡ Interactive Dividend Capital & Tax Calculator</h3>
        <p>Estimate the exact capital required for your target monthly income after accounting for US withholding taxes, local taxes, and ETF expense fees.</p>
      </div>
      <div class="calc-grid">
        <div class="calc-inputs">
          <div class="calc-form-group">
            <label for="calc-monthly-target">Target Monthly Income ($ or €):</label>
            <input type="number" id="calc-monthly-target" value="2000" min="100" step="100">
          </div>

          <div class="calc-form-group">
            <label for="calc-gross-yield">Estimated Gross Portfolio Yield (%):</label>
            <input type="number" id="calc-gross-yield" value="3.5" min="0.5" max="15" step="0.1">
          </div>

          <div class="calc-form-group">
            <label for="calc-country">Investor Country (Local Tax Rate):</label>
            <select id="calc-country">
              <option value="IT" selected>Italy - IT (26%)</option>
              <option value="ES">Spain - ES (19%)</option>
              <option value="UK">United Kingdom - UK/EN (8.75%)</option>
              <option value="FR">France - FR (30%)</option>
              <option value="NL">Netherlands - NL/OL (15%)</option>
              <option value="DE">Germany - DE (26.375%)</option>
              <option value="US">United States - US (15%)</option>
              <option value="CUSTOM">Custom Aliquot</option>
            </select>
          </div>

          <div class="calc-form-group" id="calc-custom-tax-group" style="display:none;">
            <label for="calc-custom-tax">Custom Local Tax Rate (%):</label>
            <input type="number" id="calc-custom-tax" value="20" min="0" max="50" step="0.5">
          </div>

          <div class="calc-form-group">
            <label for="calc-us-wht">US Dividend Withholding Tax (%):</label>
            <select id="calc-us-wht">
              <option value="15" selected>15% (Standard W-8BEN Tax Treaty)</option>
              <option value="30">30% (No Tax Treaty)</option>
              <option value="0">0% (US Domestic / Non-US Stock)</option>
            </select>
          </div>

          <div class="calc-form-group">
            <label for="calc-ter">Fund Expense Ratio / TER (%):</label>
            <input type="number" id="calc-ter" value="0.20" min="0" max="2" step="0.01">
          </div>
        </div>

        <div class="calc-results-card">
          <div class="calc-result-main">
            <div class="calc-result-label">Required Capital Target</div>
            <div class="calc-result-value" id="calc-result-capital">$0</div>
            <div class="calc-result-sub" id="calc-result-netyield">Net Yield: 0.00%</div>
          </div>

          <div class="calc-details-list">
            <div class="calc-detail-item">
              <span>Annual Gross Dividend Target:</span>
              <strong id="calc-detail-gross-target">$0</strong>
            </div>
            <div class="calc-detail-item">
              <span>Estimated Annual Taxes:</span>
              <strong id="calc-detail-taxes" style="color:#ef4444;">$0</strong>
            </div>
            <div class="calc-detail-item">
              <span>Total Tax & Fee Friction:</span>
              <strong id="calc-detail-drag">0.00%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Elements
  const monthlyInput = document.getElementById("calc-monthly-target");
  const grossYieldInput = document.getElementById("calc-gross-yield");
  const countrySelect = document.getElementById("calc-country");
  const customTaxGroup = document.getElementById("calc-custom-tax-group");
  const customTaxInput = document.getElementById("calc-custom-tax");
  const usWhtSelect = document.getElementById("calc-us-wht");
  const terInput = document.getElementById("calc-ter");

  const resultCapital = document.getElementById("calc-result-capital");
  const resultNetYield = document.getElementById("calc-result-netyield");
  const detailGrossTarget = document.getElementById("calc-detail-gross-target");
  const detailTaxes = document.getElementById("calc-detail-taxes");
  const detailDrag = document.getElementById("calc-detail-drag");

  function calculate() {
    const monthlyTarget = parseFloat(monthlyInput.value) || 0;
    const annualTarget = monthlyTarget * 12;
    const grossYieldPercent = parseFloat(grossYieldInput.value) || 0;

    let localTaxPercent = 0;
    const countryKey = countrySelect.value;
    if (countryKey === "CUSTOM") {
      customTaxGroup.style.display = "block";
      localTaxPercent = parseFloat(customTaxInput.value) || 0;
    } else {
      customTaxGroup.style.display = "none";
      localTaxPercent = countryTaxRates[countryKey].rate;
    }

    const usWhtPercent = parseFloat(usWhtSelect.value) || 0;
    const terPercent = parseFloat(terInput.value) || 0;

    // Calculation logic:
    // Dividend net multiplier after WHT and Local Tax:
    // Net Dividend Factor = (1 - US WHT) * (1 - Local Tax)
    const whtFactor = 1 - (usWhtPercent / 100);
    const localTaxFactor = 1 - (localTaxPercent / 100);
    const combinedTaxFactor = whtFactor * localTaxFactor;

    // Effective Net Yield %
    const netYieldPercent = (grossYieldPercent * combinedTaxFactor) - terPercent;

    if (netYieldPercent <= 0) {
      resultCapital.textContent = "N/A";
      resultNetYield.textContent = "Net Yield ≤ 0% (Friction too high)";
      detailGrossTarget.textContent = `$${annualTarget.toLocaleString()}`;
      detailTaxes.textContent = "N/A";
      detailDrag.textContent = "100%";
      return;
    }

    // Required Capital = Annual Net Income Target / (Net Yield % / 100)
    const requiredCapital = annualTarget / (netYieldPercent / 100);

    // Required Gross Dividend Income before tax
    const requiredGrossIncome = requiredCapital * (grossYieldPercent / 100);
    const annualTaxesPaid = requiredGrossIncome - annualTarget;
    const totalTaxFeeDragPercent = ((requiredGrossIncome - annualTarget) / requiredGrossIncome) * 100;

    // Format output
    resultCapital.textContent = `$${Math.round(requiredCapital).toLocaleString()}`;
    resultNetYield.textContent = `Net Yield: ${netYieldPercent.toFixed(2)}% (After ${localTaxPercent}% Local Tax + ${usWhtPercent}% WHT)`;
    detailGrossTarget.textContent = `$${Math.round(requiredGrossIncome).toLocaleString()}`;
    detailTaxes.textContent = `$${Math.round(annualTaxesPaid).toLocaleString()}`;
    detailDrag.textContent = `${totalTaxFeeDragPercent.toFixed(1)}% of gross yield`;
  }

  // Event Listeners
  [monthlyInput, grossYieldInput, countrySelect, customTaxInput, usWhtSelect, terInput].forEach(el => {
    el.addEventListener("input", calculate);
    el.addEventListener("change", calculate);
  });

  // Initial Calculation
  calculate();
});
