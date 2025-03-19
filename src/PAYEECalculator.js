import { useState } from "react";
import "./styles.css"; // Ensure styles are imported

const PAYEECalculator = () => {
  const [salary, setSalary] = useState(""); // Initially empty input
  const [pension, setPension] = useState(true);
  const [nhf, setNHF] = useState(false);
  const [nhis, setNHIS] = useState(false);
  const [payee, setPayee] = useState(null);
  const [netSalary, setNetSalary] = useState(null);
  const [annualPayee, setAnnualPayee] = useState(null);
  const [monthlyPension, setMonthlyPension] = useState(null);

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    });
  };

  const calculatePAYEE = () => {
    const annualSalary = salary * 12;

    // Deductions
    const pensionDeduction = pension ? annualSalary * 0.60 * 0.08 : 0;
    const nhfDeduction = nhf ? annualSalary * 0.60 * 0.025 : 0;
    const nhisDeduction = nhis ? annualSalary * 0.60 * 0.05 : 0;
    const totalStatutoryDeductions = pensionDeduction + nhfDeduction + nhisDeduction;
    const redefinedAnnualPay = annualSalary - totalStatutoryDeductions;

    // Tax relief calculation
    const fixedRelief = 200000;
    const variableRelief = redefinedAnnualPay * 0.2;
    const minRelief = Math.max(0.01 * redefinedAnnualPay, 200000);
    const totalRelief = minRelief + variableRelief + totalStatutoryDeductions;

    // Taxable Income
    let taxableIncome = annualSalary - totalRelief;
    taxableIncome = taxableIncome > 0 ? taxableIncome : 0;

    // PAYEE Tax Calculation
    let remaining = taxableIncome;
    let tax = 0;
    const taxBrackets = [300000, 300000, 500000, 500000, 1600000, 3200000];
    const rates = [0.07, 0.11, 0.15, 0.19, 0.21, 0.24];

    let amounts = [];
    let bases = [];
    let amount = taxableIncome;

    for (let i = 0; i < taxBrackets.length; i++) {
      let newAmount = amount > taxBrackets[i] ? amount - taxBrackets[i] : 0;
      amounts.push(newAmount);
      bases.push(amount > taxBrackets[i] ? taxBrackets[i] : amount);
      amount = newAmount;
    }

    for (let i = 0; i < bases.length; i++) {
      tax += bases[i] * rates[i];
    }

    if (amounts[5] > 3200000) {
      tax += (amounts[5] - 3200000) * 0.24;
    }

    const annualPAYEE = tax;
    const monthlyPAYEE = tax / 12;
    setAnnualPayee(formatCurrency(annualPAYEE));
    setPayee(formatCurrency(monthlyPAYEE));
    setMonthlyPension(formatCurrency(pensionDeduction / 12));

    // Net Salary Calculation
    const netAnnualSalary = annualSalary - (annualPAYEE + totalStatutoryDeductions);
    setNetSalary(formatCurrency(netAnnualSalary / 12));
  };

  return (
    <div className="container">
      <h2>PAYEE Calculator</h2>
      <input
        type="number"
        placeholder="Enter Monthly Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        className="input-field"
      />

      <div className="deductions">
        <label className="toggle-switch">
          <span>Pension (8%)</span>
          <input type="checkbox" checked={pension} onChange={() => setPension(!pension)} />
          <span className="slider"></span>
        </label>

        <label className="toggle-switch">
          <span>NHF (2.5%)</span>
          <input type="checkbox" checked={nhf} onChange={() => setNHF(!nhf)} />
          <span className="slider"></span>
        </label>

        <label className="toggle-switch">
          <span>NHIS (5%)</span>
          <input type="checkbox" checked={nhis} onChange={() => setNHIS(!nhis)} />
          <span className="slider"></span>
        </label>
      </div>

      <button onClick={calculatePAYEE} className="calculate-btn">Calculate PAYEE</button>

      {payee !== null && (
        <div className="results">
          <h3>Results</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PAYEE per annum</td>
                <td>{annualPayee}</td>
              </tr>
              <tr>
                <td>Monthly Tax Pay</td>
                <td>{payee}</td>
              </tr>
              <tr>
                <td>Monthly Pension</td>
                <td>{monthlyPension}</td>
              </tr>
              <tr>
                <td>Net Monthly Salary</td>
                <td>{netSalary}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <footer className="footer">
        Developed by: <a href="https://www.linkedin.com/in/tayoasaolu" target="_blank" rel="noopener noreferrer">Tayo</a>
      </footer>
    </div>
  );
};

export default PAYEECalculator;