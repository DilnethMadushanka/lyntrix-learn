import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Sparkles,
  Lock
} from 'lucide-react';

export const FeePaymentModal = () => {
  const { 
    paymentModalData, 
    setPaymentModalData, 
    currentStudent, 
    submitBankSlip, 
    processInstantCardPayment,
    showToast 
  } = useApp();

  const [paymentMode, setPaymentMode] = useState('card');
  
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('742');

  const [slipForm, setSlipForm] = useState({
    bank: 'Commercial Bank',
    referenceNo: '',
    amount: paymentModalData?.batch?.monthlyFee || 3500,
    slipImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  });

  if (!paymentModalData) return null;

  const { batch, instructor } = paymentModalData;

  const handleCardSubmit = (e) => {
    e.preventDefault();
    processInstantCardPayment({
      studentId: currentStudent.id,
      batchId: batch.id,
      amount: batch.monthlyFee
    });
  };

  const handleSlipSubmit = (e) => {
    e.preventDefault();
    if (!slipForm.referenceNo) {
      showToast("Please enter the deposit receipt reference number", "error");
      return;
    }

    submitBankSlip({
      studentId: currentStudent.id,
      batchId: batch.id,
      amount: slipForm.amount,
      bank: slipForm.bank,
      referenceNo: slipForm.referenceNo,
      slipImage: slipForm.slipImage
    });

    setPaymentModalData(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-base">August 2026 Monthly Class Fee</h3>
            <p className="text-xs text-blue-600 font-bold">{batch.title}</p>
          </div>
          <button
            onClick={() => setPaymentModalData(null)}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Amount Summary */}
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-600 font-medium">Instructor: {instructor.name}</div>
            <div className="text-sm font-bold text-slate-900">{batch.code} • 1 Month Access</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Total Fee</div>
            <div className="text-xl font-black text-emerald-600">LKR {batch.monthlyFee}</div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setPaymentMode('card')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              paymentMode === 'card'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Instant Card Gateway</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('slip')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              paymentMode === 'slip'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Bank Slip</span>
          </button>
        </div>

        {/* FORM 1: ONLINE CARD PAYMENT */}
        {paymentMode === 'card' && (
          <form onSubmit={handleCardSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted Payment</span>
              </div>
              <p className="text-[11px] text-slate-500">Instant class activation upon successful card authorization.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Card Number:</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
                <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date:</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CVC / CVV:</label>
                <input
                  type="password"
                  maxLength={3}
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              <span>Pay LKR {batch.monthlyFee} & Activate Instantly</span>
            </button>
          </form>
        )}

        {/* FORM 2: BANK DEPOSIT SLIP UPLOAD */}
        {paymentMode === 'slip' && (
          <form onSubmit={handleSlipSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="font-bold text-blue-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Sir's Direct Bank Account:</span>
              </div>
              <div className="text-slate-700 font-medium">
                Bank: <strong className="text-slate-900">{instructor.bankDetails?.bank || "Commercial Bank"}</strong>
              </div>
              <div className="text-slate-700 font-medium">
                Account Name: <strong className="text-slate-900">{instructor.bankDetails?.accountName || instructor.name}</strong>
              </div>
              <div className="text-slate-700 font-medium">
                Account Number: <strong className="text-emerald-600 font-mono text-sm">{instructor.bankDetails?.accountNumber || "8009124451"}</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Deposited Bank:</label>
              <select
                value={slipForm.bank}
                onChange={(e) => setSlipForm({ ...slipForm, bank: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="Commercial Bank">Commercial Bank of Ceylon</option>
                <option value="Bank of Ceylon (BOC)">Bank of Ceylon (BOC)</option>
                <option value="Sampath Bank">Sampath Bank PLC</option>
                <option value="Hatton National Bank (HNB)">Hatton National Bank (HNB)</option>
                <option value="People's Bank">People's Bank</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deposit Slip Reference No:</label>
              <input
                type="text"
                placeholder="e.g. COMB-889921 or CDM-4512"
                value={slipForm.referenceNo}
                onChange={(e) => setSlipForm({ ...slipForm, referenceNo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Slip Photo / Screenshot:</label>
              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center gap-3">
                <img
                  src={slipForm.slipImage}
                  alt="Slip preview"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                />
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="text-slate-900 font-bold">deposit_receipt_august.jpg</div>
                  <span className="text-[10px] text-emerald-600 font-bold">✓ Image verified & ready to upload</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Slip for Teacher Approval</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
