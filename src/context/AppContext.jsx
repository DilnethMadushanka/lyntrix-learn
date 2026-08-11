import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_INSTRUCTORS, 
  INITIAL_LESSONS, 
  INITIAL_STUDENTS, 
  INITIAL_BANK_SLIPS, 
  INITIAL_ATTENDANCE_LOGS,
  INITIAL_QUIZZES,
  PLATFORM_METRICS 
} from '../data/mockData';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Role State: 'landing' | 'admin' | 'teacher' | 'student' | 'scanner'
  const [currentRole, setCurrentRole] = useState('landing');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Theme State: 'royal' | 'emerald' | 'light' | 'cyber'
  const [theme, setTheme] = useState('light');

  // Super Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Active Entities
  const [instructors, setInstructors] = useState(INITIAL_INSTRUCTORS);
  const [currentTeacherId, setCurrentTeacherId] = useState('ins-kasun-maths');
  
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [currentStudentId, setCurrentStudentId] = useState('std-8821');
  
  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const [bankSlips, setBankSlips] = useState(INITIAL_BANK_SLIPS);
  const [attendanceLogs, setAttendanceLogs] = useState(INITIAL_ATTENDANCE_LOGS);
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  
  // UI & Localization
  const [lang, setLang] = useState('en');
  const [toast, setToast] = useState(null);

  // Active Modals / Interactive Sub-states
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [selectedSlipForReview, setSelectedSlipForReview] = useState(null);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && prev.id === toast?.id ? null : prev));
    }, 4500);
  };

  const currentTeacher = instructors.find(ins => ins.id === currentTeacherId) || instructors[0];
  const currentStudent = students.find(std => std.id === currentStudentId) || students[0];

  // Admin login check
  const adminLogin = (email, password) => {
    if (
      (email === 'admin@lyntrix.learn' || email === 'admin') && 
      (password === 'SuperAdmin@2026' || password === 'admin123')
    ) {
      setIsAdminAuthenticated(true);
      sound.playChimeApproved();
      showToast("Super Admin Authenticated Successfully!", "success");
      return true;
    }
    return false;
  };

  // Register New Student (Self-signup)
  const registerStudent = (studentData) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const indexNumber = `LYN-26-${randomSuffix}`;
    const qrToken = `QR-LYN-${randomSuffix}`;

    const newStudent = {
      id: `std-${Date.now()}`,
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      batch: studentData.batchYear || '2026 A/L',
      stream: studentData.stream || 'Physical Science (Maths)',
      district: studentData.district || 'Colombo',
      address: studentData.address || 'Sri Lanka',
      indexNumber,
      qrToken,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      activeMonth: 'August 2026',
      enrollments: [
        {
          instructorId: 'ins-kasun-maths',
          batchId: 'batch-kasun-2025',
          paymentStatus: 'Pending',
          progress: 0,
          attendanceRate: 100,
          tuteDelivery: {
            packTitle: `${studentData.batchYear || '2026 A/L'} August Theory Pack`,
            courier: 'PromptX Express',
            trackingNumber: `PRX-${Math.floor(100000 + Math.random() * 900000)}`,
            status: 'Packed'
          }
        }
      ]
    };

    setStudents(prev => [newStudent, ...prev]);
    setCurrentStudentId(newStudent.id);
    sound.playChimeApproved();

    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}

    return newStudent;
  };

  // Add Student by Teacher / Staff (Manual enrollment)
  const addStudentByTeacher = (studentData) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const indexNumber = `LYN-26-${randomSuffix}`;
    const qrToken = `QR-LYN-${randomSuffix}`;

    const newStudent = {
      id: `std-${Date.now()}`,
      name: studentData.name,
      email: studentData.email || `${studentData.name.toLowerCase().replace(/[^a-z]/g, '')}@student.lk`,
      phone: studentData.phone,
      batch: studentData.batchYear || '2025 A/L',
      stream: studentData.stream || 'Combined Maths',
      district: studentData.district || 'Colombo',
      address: studentData.address || 'Classroom Hall Attendance',
      indexNumber,
      qrToken,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      activeMonth: 'August 2026',
      enrollments: [
        {
          instructorId: currentTeacherId,
          batchId: studentData.batchId || currentTeacher.batches[0]?.id,
          paymentStatus: studentData.paymentStatus || 'Paid',
          progress: 0,
          attendanceRate: 100,
          tuteDelivery: {
            packTitle: 'August Theory Pack',
            courier: 'Hand Delivery',
            trackingNumber: `DIR-${randomSuffix}`,
            status: 'Delivered'
          }
        }
      ]
    };

    setStudents(prev => [newStudent, ...prev]);
    sound.playChimeApproved();
    showToast(`Student ${studentData.name} enrolled with Index ${indexNumber}!`, 'success');
    return newStudent;
  };

  // Upgrade Teacher SaaS Subscription
  const upgradeTeacherSubscription = (teacherId, planId) => {
    const tierName = planId === 'starter' ? 'Starter Master' : planId === 'enterprise' ? 'Enterprise Titan' : 'Pro Academy';
    const price = planId === 'starter' ? 9500 : planId === 'enterprise' ? 45000 : 22500;

    setInstructors(prev => prev.map(ins => {
      if (ins.id === teacherId) {
        return {
          ...ins,
          subscription: {
            tier: tierName,
            status: 'active',
            trialDaysLeft: 0,
            renewalDate: 'September 26, 2026',
            monthlyPriceLKR: price
          }
        };
      }
      return ins;
    }));
  };

  // Extend Teacher Trial (Super Admin action)
  const extendTeacherTrial = (teacherId, additionalDays = 14) => {
    setInstructors(prev => prev.map(ins => {
      if (ins.id === teacherId) {
        const currentDays = ins.subscription?.trialDaysLeft || 0;
        return {
          ...ins,
          subscription: {
            ...ins.subscription,
            status: 'trialing',
            trialDaysLeft: currentDays + additionalDays
          }
        };
      }
      return ins;
    }));
    sound.playChimeApproved();
    showToast(`Free trial extended by +${additionalDays} days for Master!`, 'success');
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentRole('landing');
    sound.playClick();
    showToast("Super Admin Logged Out", "info");
  };

  const approveBankSlip = (slipId) => {
    sound.playChimeApproved();
    setBankSlips(prev => prev.map(slip => {
      if (slip.id === slipId) {
        return { ...slip, status: 'approved' };
      }
      return slip;
    }));

    const slip = bankSlips.find(s => s.id === slipId);
    if (slip) {
      setStudents(prevStudents => prevStudents.map(std => {
        if (std.id === slip.studentId) {
          const updatedEnrollments = std.enrollments.map(enr => {
            if (enr.batchId === slip.batchId || !enr.batchId) {
              return { ...enr, paymentStatus: 'Paid', paidDate: new Date().toISOString().split('T')[0] };
            }
            return enr;
          });
          return { ...std, enrollments: updatedEnrollments };
        }
        return std;
      }));

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      showToast(`Bank Slip Approved! SMS notification sent to ${slip.studentName} (+94 7X...)`, 'success');
      setSelectedSlipForReview(null);
    }
  };

  const rejectBankSlip = (slipId, reason = "Image unclear or Reference mismatch") => {
    sound.playBuzzerError();
    setBankSlips(prev => prev.map(slip => {
      if (slip.id === slipId) {
        return { ...slip, status: 'rejected', rejectionReason: reason };
      }
      return slip;
    }));
    showToast(`Bank Slip Rejected: ${reason}`, 'error');
    setSelectedSlipForReview(null);
  };

  const submitBankSlip = ({ studentId, batchId, amount, bank, referenceNo, slipImage }) => {
    const student = students.find(s => s.id === studentId);
    const teacher = instructors.find(ins => ins.batches.some(b => b.id === batchId));
    const batch = teacher?.batches.find(b => b.id === batchId);

    const newSlip = {
      id: `slip-${Date.now()}`,
      studentId,
      studentName: student?.name || 'Student',
      studentIndex: student?.indexNumber || 'LYN-STD',
      studentPhone: student?.phone || '+94 77 000 0000',
      instructorId: teacher?.id,
      batchId,
      batchTitle: batch?.title || 'Tuition Batch',
      amount: Number(amount) || batch?.monthlyFee || 3500,
      depositDate: new Date().toISOString().split('T')[0],
      uploadedAt: new Date().toLocaleString(),
      bank: bank || 'Commercial Bank Online',
      referenceNo: referenceNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      slipImage: slipImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      status: 'pending',
      remarks: 'Student submitted via portal.'
    };

    setBankSlips(prev => [newSlip, ...prev]);

    setStudents(prevStudents => prevStudents.map(std => {
      if (std.id === studentId) {
        const existingEnrollment = std.enrollments.find(e => e.batchId === batchId);
        let updatedEnrollments;
        if (existingEnrollment) {
          updatedEnrollments = std.enrollments.map(e => e.batchId === batchId ? { ...e, paymentStatus: 'Pending' } : e);
        } else {
          updatedEnrollments = [
            ...std.enrollments,
            { batchId, instructorId: teacher?.id, paymentStatus: 'Pending', paidDate: null, progress: 0, attendanceRate: 100 }
          ];
        }
        return { ...std, enrollments: updatedEnrollments };
      }
      return std;
    }));

    sound.playClick();
    showToast("Bank slip uploaded successfully! Waiting for Teacher approval.", "info");
  };

  const processInstantCardPayment = ({ studentId, batchId, amount }) => {
    const student = students.find(s => s.id === studentId);
    const teacher = instructors.find(ins => ins.batches.some(b => b.id === batchId));

    setStudents(prevStudents => prevStudents.map(std => {
      if (std.id === studentId) {
        const existingEnrollment = std.enrollments.find(e => e.batchId === batchId);
        let updatedEnrollments;
        if (existingEnrollment) {
          updatedEnrollments = std.enrollments.map(e => e.batchId === batchId ? { ...e, paymentStatus: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : e);
        } else {
          updatedEnrollments = [
            ...std.enrollments,
            { batchId, instructorId: teacher?.id, paymentStatus: 'Paid', paidDate: new Date().toISOString().split('T')[0], progress: 0, attendanceRate: 100 }
          ];
        }
        return { ...std, enrollments: updatedEnrollments };
      }
      return std;
    }));

    sound.playChimeApproved();
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}

    showToast("Payment Successful! Class access activated instantly.", "success");
    setPaymentModalData(null);
  };

  const markAttendanceByQR = (scannedCode) => {
    const student = students.find(
      s => s.qrToken === scannedCode || s.indexNumber === scannedCode || s.id === scannedCode
    );

    if (!student) {
      sound.playBuzzerError();
      return {
        success: false,
        message: "Invalid or Unknown QR Card! Student not registered in Lyntrix Learn."
      };
    }

    const enrollment = student.enrollments.find(e => e.instructorId === currentTeacherId);
    const isPaid = enrollment && enrollment.paymentStatus === 'Paid';

    if (!isPaid) {
      sound.playBuzzerError();
      const newLog = {
        id: `att-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        studentIndex: student.indexNumber,
        batchId: enrollment?.batchId || 'N/A',
        batchCode: 'ATT-CHECK',
        timestamp: new Date().toLocaleTimeString(),
        type: 'Hall Scanner',
        status: 'Blocked - Fee Unpaid',
        feeStatus: enrollment?.paymentStatus || 'Not Enrolled'
      };
      setAttendanceLogs(prev => [newLog, ...prev]);
      return {
        success: false,
        student,
        feeStatus: enrollment?.paymentStatus || 'Not Enrolled',
        message: `⚠️ Access Warning: ${student.name}'s August class fee is ${enrollment?.paymentStatus || 'Not Paid'}.`
      };
    }

    sound.playBeepSuccess();
    const newLog = {
      id: `att-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentIndex: student.indexNumber,
      batchId: enrollment.batchId,
      batchCode: 'KM-2025-TH',
      timestamp: new Date().toLocaleTimeString(),
      type: 'Hall Laser Scanner',
      status: 'Present - Verified',
      feeStatus: 'Paid'
    };

    setAttendanceLogs(prev => [newLog, ...prev]);
    return {
      success: true,
      student,
      feeStatus: 'Paid',
      message: `✅ Access Granted: ${student.name} (${student.indexNumber}) marked PRESENT.`
    };
  };

  const addLesson = (newLessonData) => {
    const newLesson = {
      id: `les-${Date.now()}`,
      instructorId: currentTeacherId,
      viewsCount: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...newLessonData
    };
    setLessons(prev => [newLesson, ...prev]);
    sound.playClick();
    showToast("New video lecture uploaded & published to students!", "success");
  };

  const switchRole = (role) => {
    sound.playClick();
    setCurrentRole(role);
    setActiveTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole: switchRole,
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        instructors,
        setInstructors,
        currentTeacherId,
        setCurrentTeacherId,
        currentTeacher,
        students,
        setStudents,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
        lessons,
        setLessons,
        bankSlips,
        setBankSlips,
        attendanceLogs,
        quizzes,
        lang,
        setLang,
        toast,
        showToast,
        approveBankSlip,
        rejectBankSlip,
        submitBankSlip,
        processInstantCardPayment,
        markAttendanceByQR,
        addLesson,
        registerStudent,
        addStudentByTeacher,
        upgradeTeacherSubscription,
        extendTeacherTrial,
        activeLesson,
        setActiveLesson,
        activeQuiz,
        setActiveQuiz,
        paymentModalData,
        setPaymentModalData,
        selectedSlipForReview,
        setSelectedSlipForReview,
        showIdCardModal,
        setShowIdCardModal,
        showAuthModal,
        setShowAuthModal,
        platformMetrics: PLATFORM_METRICS
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
