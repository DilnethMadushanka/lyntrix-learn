import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  Upload, 
  ShieldCheck, 
  Globe, 
  Check, 
  ArrowRight, 
  Lock,
  Building2,
  Zap,
  HelpCircle
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const TeacherPlanCheckoutModal = ({ isOpen, onClose, initialPlan = null }) => {
  const { setCurrentRole, showToast } = useApp();

  const defaultPlan = initialPlan || {
    id: 'pro-master',
    name: 'PRO MASTER SUITE',
    priceLKR: '9,800',
    numericPrice: 9800,
    features: [
      'Up to 1,500 Active Students',
      'Anti-Piracy Moving Watermark Player',
      'High-Speed Laser QR Attendance Terminal',
      'Online Card Payment Gateway + Slip Approvals',
      '500 GB Encrypted Video CDN Storage',
      'Custom Subdomain (e.g. kasunmaths.lyntrix.learn)'
    ]
  };

  const [plan, setPlan] = useState(defaultPlan);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'slip'
  const [step, setStep] = useState(1); // 1: Info -> 2: Payment -> 3: Success

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    subject: 'Combined Mathematics',
    subdomain: '',
    email: '',
    phone: '',
    password: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    slipBank: 'Commercial Bank of Ceylon',
    slipRef: '',
    slipImage: null
  });

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubdomainChange = (val) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, subdomain: clean }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subdomain || !formData.email || !formData.phone) {
      showToast('Please fill in all teacher & subdomain fields.', 'error');
      return;
    }
    setStep(2);
    sound.playClick();
  };

  const handleCompletePurchase = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      sound.playChimeApproved();
      
      showToast(`🎉 Academy Portal Activated! Welcome Master ${formData.name}`, 'success');
      setStep(3);
    }, 1200);
  };

  const handleEnterStudio = () => {
    onClose();
    setCurrentRole('teacher');
  };

  return (
    <div className="fixed inset-0 z-[130] bg-slate-950/80 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto relative">
        {/* Top Gradient Header Accent */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center font-bold transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Multi-Master SaaS Onboarding</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">Create Your Branded Sir Portal</h2>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-200 text-xs">
          <div className={`flex-1 text-center font-bold py-1.5 rounded-xl transition ${step === 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}>
            1. Academy Details
          </div>
          <div className={`flex-1 text-center font-bold py-1.5 rounded-xl transition ${step === 2 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}>
            2. Plan Payment
          </div>
          <div className={`flex-1 text-center font-bold py-1.5 rounded-xl transition ${step === 3 ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}>
            3. Instant Activation
          </div>
        </div>

        {/* STEP 1: ACADEMY DETAILS & SUBDOMAIN */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="space-y-5">
            {/* Selected Plan Summary Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Selected SaaS Package</span>
                <h4 className="font-black text-slate-900 text-base">{plan.name}</h4>
                <p className="text-xs text-slate-500">Includes anti-piracy video player & automatic slip approvals.</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-blue-700">LKR {plan.priceLKR}</div>
                <div className="text-[10px] text-slate-500 font-medium">per month • 14 days free trial</div>
              </div>
            </div>

            {/* Subdomain Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Choose Your Custom Academy Subdomain:
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 shadow-sm">
                <div className="pl-3 text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. kasunmaths"
                  value={formData.subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  className="flex-1 bg-transparent px-2.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none"
                />
                <span className="bg-slate-200 text-slate-700 px-3 py-2.5 text-xs font-mono font-bold border-l border-slate-300">
                  .lyntrix.learn
                </span>
              </div>
              {formData.subdomain && (
                <div className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>https://{formData.subdomain}.lyntrix.learn is available!</span>
                </div>
              )}
            </div>

            {/* Teacher Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructor Full Name (Sir):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eng. Kasun Ranasinghe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject Specialization:</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="Combined Mathematics">Combined Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="A/L ICT">A/L ICT</option>
                  <option value="Biology">Biology</option>
                  <option value="Commerce & Accounting">Commerce & Accounting</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  placeholder="kasun.maths@lyntrix.learn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Contact Number:</label>
                <input
                  type="tel"
                  required
                  placeholder="077 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === 2 && (
          <form onSubmit={handleCompletePurchase} className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Subdomain:</span> <strong className="text-slate-900 font-mono">{formData.subdomain}.lyntrix.learn</strong>
              </div>
              <div>
                <span className="text-slate-500">Total Due:</span> <strong className="text-emerald-600 font-black text-sm">LKR {plan.priceLKR}</strong>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  paymentMethod === 'card'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Instant Card Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('slip')}
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  paymentMethod === 'slip'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Bank Deposit Slip</span>
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number:</label>
                  <input
                    type="text"
                    required
                    placeholder="4111 2222 3333 4444"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date:</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVC / CWW:</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={formData.cardCvc}
                      onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bank-Grade 256-Bit SSL Encrypted Card Gateway</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">Lyntrix SaaS Corporate Bank Account:</div>
                  <div className="text-slate-600">Bank: <strong>Commercial Bank of Ceylon PLC</strong></div>
                  <div className="text-slate-600">Account Name: <strong>Lyntrix Technologies (Pvt) Ltd</strong></div>
                  <div className="text-slate-600">Account No: <strong className="font-mono text-blue-700">1009845231</strong></div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deposit Slip Reference Number:</label>
                  <input
                    type="text"
                    required
                    placeholder="COMB-9982410"
                    value={formData.slipRef}
                    onChange={(e) => setFormData({ ...formData, slipRef: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                {isLoading ? (
                  <span>Activating SaaS Portal...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Pay LKR {plan.priceLKR} & Activate Sir Portal</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: INSTANT ACTIVATION & RECEIPT */}
        {step === 3 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">🎉 Congratulations Master {formData.name}!</h3>
              <p className="text-xs text-slate-500 mt-1">Your branded academy portal has been successfully provisioned and activated.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Live Academy Subdomain:</span>
                <strong className="text-blue-700 font-mono">https://{formData.subdomain}.lyntrix.learn</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Subscribed Package:</span>
                <strong className="text-slate-900">{plan.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trial Status:</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">Active (14-Day Free Access)</span>
              </div>
            </div>

            <button
              onClick={handleEnterStudio}
              className="w-full max-w-md py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xl shadow-blue-500/20 transition flex items-center justify-center gap-2 mx-auto active:scale-95"
            >
              <span>🚀 Enter My Branded Sir Studio Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
