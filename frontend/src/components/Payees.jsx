import React from "react";

const Payees = ({ payees, onSendMoneyClick }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#273469] mb-6">Payees</h1>

      {payees.length === 0 ? (
        <p className="text-gray-500">No payees added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {payees.map((p) => (
            <div
              key={p.userId || p.userName}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-all duration-200"
            >
              <div>
                <div className="font-semibold text-lg text-[#1e2749]">
                  {p.firstName} {p.lastName}
                </div>
                <div className="text-sm text-gray-500">{p.userName}</div>
              </div>
              <button
                onClick={() => onSendMoneyClick(p.userName)} // ✅ send username
                className="btn-primary text-sm"
              >
                Send Money
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payees;