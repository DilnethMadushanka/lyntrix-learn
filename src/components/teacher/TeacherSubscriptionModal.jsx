import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Clock, 
  Zap, 
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { SAAS_PRICING_PLANS } from '../../data/mockData';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';

export const TeacherSubscriptionModal = ({ isOpen, onClose }) => {
  const { currentTeacher, upgradeTeacherSubscription, showToast } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly' (20% discount)
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'bank_transfer'
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentSub = currentTeacher.subscription || {
    tier: 'Pro Academy (Trial)',
    status: 'trialing',
    trialDaysLeft: 12,
    renewalDate: 'August 25, 2026'
  };

  const handleUpgrade = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      upgradeTeacherSubscription(currentTeacher.id, selectedPlanId);
      sound.playChimeApproved();
      try {
        confetti({ particleCount: 120, spread: 85, origin: { y: 0.5 } });
      } catch (e) {}
      
      setIsProcessing(false);
      onClose();
      showToast(`Subscription Upgraded to ${selectedPlanId.toUpperCase()} Tier! Full access activated.`, 'success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 my-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Lyntrix SaaS Subscription & Free Trial</h3>
              <p className="text-xs text-slate-500">Academy Studio for {currentTeacher.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold">
            ✕
          </button>
        </div>

        {/* Current Trial Status Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-800">
                14-Day Free Trial Active ({currentSub.trialDaysLeft} Days Remaining)
              </div>
              <p className="text-[11px] text-slate-600">
                Your trial includes all Pro Academy features. Subscribe anytime to keep your custom subdomain active.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold shrink-0">
            Trial Mode
          </span>
        </div>

        {/* Plan Selector Grid */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">Select Your Monthly SaaS Tier:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAAS_PRICING_PLANS.map(plan => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{plan.name}</span>
                      {plan.popular && (
                        <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-black text-slate-900">
                      LKR {plan.priceLKR}
                      <span className="text-[10px] text-slate-400 font-normal"> /mo</span>
                    </div>
                    <ul className="text-[10px] text-slate-600 space-y-1 pt-2 border-t border-slate-200/60">
                      {plan.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 pt-2">
                    <span className={`w-full py-1 rounded-lg text-[10px] font-bold text-center block ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isSelected ? 'Selected' : 'Choose Plan'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">Payment Method for Lyntrix Subscription:</label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                paymentMethod === 'card' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Credit / Debit Card (PayHere)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('bank_transfer')}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                paymentMethod === 'bank_transfer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Direct Bank Deposit</span>
            </button>
          </div>

          {paymentMethod === 'bank_transfer' && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-700">
              <div className="font-bold text-slate-900">Lyntrix Platform Bank Account:</div>
              <div>Bank: <strong>Commercial Bank of Ceylon (Head Office)</strong></div>
              <div>Account Name: <strong>Lyntrix SaaS Technologies (Pvt) Ltd</strong></div>
              <div>Account Number: <strong className="text-emerald-600 font-mono">10008492019</strong></div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleUpgrade}
          disabled={isProcessing}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>{isProcessing ? 'Activating Subscription...' : 'Confirm Subscription & Activate Ongoing Access'}</span>
        </button>
      </div>
    </div>
  );
};
