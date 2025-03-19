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
    setAnnualPayee(annualPAYEE.toFixed(2));
    setPayee(monthlyPAYEE.toFixed(2));
    setMonthlyPension((pensionDeduction / 12).toFixed(2));

    // Net Salary Calculation
    const netAnnualSalary = annualSalary - (annualPAYEE + totalStatutoryDeductions);
    setNetSalary((netAnnualSalary / 12).toFixed(2));
  };

return (
  <div className="app-container">
    <div className="p-5 max-w-md mx-auto border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-3">PAYEE Calculator</h2>
      <input
        type="number"
        placeholder="Enter Monthly Salary"
        value={salary}
        onChange={(e) => setSalary(parseFloat(e.target.value) || "")}
        className="border p-2 w-full mb-3"
      />
      
      {/* Statutory Deductions */}
      <div className="flex justify-between items-center mb-3">
        <label>Pension (8%)</label>
        <input type="checkbox" checked={pension} onChange={() => setPension(!pension)} />
      </div>
      <div className="flex justify-between items-center mb-3">
        <label>NHF (2.5%)</label>
        <input type="checkbox" checked={nhf} onChange={() => setNHF(!nhf)} />
      </div>
      <div className="flex justify-between items-center mb-3">
        <label>NHIS (5%)</label>
        <input type="checkbox" checked={nhis} onChange={() => setNHIS(!nhis)} />
      </div>

      {/* Calculate Button */}
      <button onClick={calculatePAYEE} className="bg-blue-500 text-white p-2 w-full">
        Calculate PAYEE
      </button>

      {/* Results */}
      {payee !== null && (
        <div className="mt-4">
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Description</th>
                <th className="border p-2">Amount (₦)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">PAYEE per annum</td>
                <td className="border p-2">{Number(annualPayee).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}</td>
              </tr>
              <tr>
                <td className="border p-2">Monthly Tax Pay</td>
                <td className="border p-2">{Number(payee).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}</td>
              </tr>
              <tr>
                <td className="border p-2">Monthly Pension</td>
                <td className="border p-2">{Number(monthlyPension).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}</td>
              </tr>
              <tr>
                <td className="border p-2">Net Monthly Salary</td>
                <td className="border p-2">{Number(netSalary).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Footer */}
    <footer className="footer">
      Developed by: <a href="https://www.linkedin.com/in/olutayo25" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Tayo</a>
    </footer>
  </div>
);

};

export default PAYEECalculator;
