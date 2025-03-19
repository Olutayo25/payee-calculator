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
    
    // Deductions (if applicable)
    const pensionDeduction = pension ? annualSalary * 0.60 * 0.08 : 0;
    const nhfDeduction = nhf ? annualSalary * 0.60 * 0.025 : 0;
    const nhisDeduction = nhis ? annualSalary * 0.60 * 0.05 : 0;
    const totalStatutoryDeductions = pensionDeduction + nhfDeduction + nhisDeduction;
    const redefinedAnnualPay = annualSalary - totalStatutoryDeductions;
    
    // Tax relief calculation
    const minRelief = Math.max(0.01 * redefinedAnnualPay, 200000);
    const totalRelief = minRelief + redefinedAnnualPay * 0.2 + totalStatutoryDeductions;
    
    // Taxable Income
    let taxableIncome = annualSalary - totalRelief;
    taxableIncome = taxableIncome > 0 ? taxableIncome : 0;
    
    // PAYEE Tax Calculation using tax brackets
    let remaining = taxableIncome;
    let tax = 0;
    const taxBrackets = [300000, 300000, 500000, 500000, 1600000, 3200000];
    const rates = [0.07, 0.11, 0.15, 0.19, 0.21, 0.24];
    
    for (let i = 0; i < taxBrackets.length; i++) {
      let taxableAmount = Math.min(remaining, taxBrackets[i]);
      tax += taxableAmount * rates[i];
      remaining -= taxableAmount;
      if (remaining <= 0) break;
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
    <div className="p-5 max-w-md mx-auto border rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-bold mb-3">PAYEE Calculator</h2>
      <input
        type="number"
        placeholder="Enter Monthly Salary"
        value={salary}
        onChange={(e) => setSalary(parseFloat(e.target.value) || "")}
        className="border p-2 w-full mb-3"
      />
      
      <div className="mb-3 flex justify-between items-center">
        <label>Pension (8%)</label>
        <input type="checkbox" checked={pension} onChange={() => setPension(!pension)} className="toggle-checkbox"/>
      </div>
      <div className="mb-3 flex justify-between items-center">
        <label>NHF (2.5%)</label>
        <input type="checkbox" checked={nhf} onChange={() => setNHF(!nhf)} className="toggle-checkbox"/>
      </div>
      <div className="mb-3 flex justify-between items-center">
        <label>NHIS (5%)</label>
        <input type="checkbox" checked={nhis} onChange={() => setNHIS(!nhis)} className="toggle-checkbox"/>
      </div>
      
      <button onClick={calculatePAYEE} className="bg-blue-500 text-white p-2 w-full rounded-lg">Calculate PAYEE</button>
      
      {payee !== null && (
        <div className="mt-4">
          <table className="w-full border-collapse border border-gray-300 mt-4 text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Description</th>
                <th className="border p-2">Amount (₦)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">PAYEE per annum</td>
                <td className="border p-2">{annualPayee}</td>
              </tr>
              <tr>
                <td className="border p-2">Monthly Tax Pay</td>
                <td className="border p-2">{payee}</td>
              </tr>
              <tr>
                <td className="border p-2">Monthly Pension</td>
                <td className="border p-2">{monthlyPension}</td>
              </tr>
              <tr>
                <td className="border p-2">Net Monthly Salary</td>
                <td className="border p-2">{netSalary}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      <footer className="mt-5 text-gray-600">
        Developed by: <a href="https://www.linkedin.com/in/tayoasaolu" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Tayo</a>
      </footer>
    </div>
  );
};

export default PAYEECalculator;