import { createClient } from '@supabase/supabase-js';

// Environment variables from Vite .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key-placeholder';

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper check to verify if actual live Supabase credentials are configured
export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_URL !== 'https://xyzcompany.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'public-anon-key-placeholder'
  );
};

// Authentication & Role-Based Access API Helpers
export const supabaseAuthService = {
  // Sign up new user (Teacher or Student)
  async signUp(email, password, role = 'student', metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role, // 'super_admin' | 'teacher' | 'student'
          name: metadata.name || '',
          phone: metadata.phone || '',
          index_number: metadata.indexNumber || '',
          subject: metadata.subject || ''
        }
      }
    });
    return { data, error };
  },

  // Log in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user session
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

// Database CRUD Services
export const supabaseDbService = {
  // 1. Fetch all teachers/academies
  async getTeachers() {
    const { data, error } = await supabase
      .from('teachers')
      .select('*, batches(*)');
    return { data, error };
  },

  // 2. Fetch video lessons for a batch
  async getLessons(batchId) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('batch_id', batchId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // 3. Upload bank slip
  async submitBankSlip(slipData) {
    const { data, error } = await supabase
      .from('bank_slips')
      .insert([slipData])
      .select();
    return { data, error };
  },

  // 4. Approve bank slip (Updates slip status and student enrollment)
  async approveBankSlip(slipId, studentId, batchId) {
    const { data: slipData, error: slipError } = await supabase
      .from('bank_slips')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', slipId);

    if (slipError) return { error: slipError };

    // Update or insert active enrollment
    const { data: enrData, error: enrError } = await supabase
      .from('enrollments')
      .upsert({
        student_id: studentId,
        batch_id: batchId,
        payment_status: 'Paid',
        paid_date: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

    return { data: { slipData, enrData }, error: enrError };
  },

  // 5. Mark Attendance
  async recordAttendance(attendanceRecord) {
    const { data, error } = await supabase
      .from('attendance_logs')
      .insert([attendanceRecord])
      .select();
    return { data, error };
  }
};
