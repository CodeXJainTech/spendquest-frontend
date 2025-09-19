import React from "react";
import Wallet from "./Wallet";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardHome = ({ balance, transactions = [] }) => {

  const monthTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const income = monthTxns
    .filter((t) => t.isReceived)
    .reduce((s, t) => s + Number(t.amount), 0);
  const expense = monthTxns
    .filter((t) => !t.isReceived)
    .reduce((s, t) => s + Number(t.amount), 0);
  const savingsPercent =
    income === 0 ? 0 : Math.max(0, ((income - expense) / income) * 100).toFixed(0);

    let startBalance = balance;
    const recentTxns = transactions.slice(-20);

    for (let i = transactions.length - 1; i >= transactions.length - recentTxns.length; i--) {
      const t = transactions[i];
      if (!t) continue;
      if (t.isReceived) {
        startBalance -= Number(t.amount);
      } else {
        startBalance += Number(t.amount);
      }
    }

    let running = startBalance;
    const graphData = [...recentTxns].reverse().map((t, i) => {
      running += t.isReceived ? Number(t.amount) : -Number(t.amount);
      return {
        txn: i + 1,
        balance: running,
        desc: t.description,
      };
    });


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Wallet balance={balance} />
        </div>

        <div className="col-span-2 bg-white p-3 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-lg font-bold text-[#273469]">This Month</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
            <div className="flex-1 bg-[#f8fafc] p-4 rounded">
              <div className="text-sm text-gray-500">Income</div>
              <div className="text-2xl font-bold">₹{income.toFixed(2)}</div>
            </div>
            <div className="flex-1 bg-[#fff7f7] p-4 rounded">
              <div className="text-sm text-gray-500">Expenses</div>
              <div className="text-2xl font-bold text-red-600">₹{expense.toFixed(2)}</div>
            </div>
            <div className="flex-1 bg-[#f7fff7] p-4 rounded">
              <div className="text-sm text-gray-500">Savings %</div>
              <div className="text-2xl font-bold">{savingsPercent}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-[#273469] mb-4">Transaction Trend</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="txn"
                label={{ value: "Transactions", position: "insideBottom", offset: -5 }}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Balance"]}
                labelFormatter={(label) => `Txn #${label}`}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-[#273469] mb-2">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-sm text-gray-500">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Description</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 6).map((txn) => (
                <tr key={txn._id || txn.id} className="border-t">
                  <td className="p-2 text-sm">
                    {new Date(txn.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-sm">{txn.description}</td>
                  <td
                    className={`p-2 text-sm font-semibold ${
                      txn.isReceived ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {txn.isReceived ? "+" : "-"}₹{txn.amount}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;