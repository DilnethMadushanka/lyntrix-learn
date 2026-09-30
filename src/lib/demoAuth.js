// Local sign-in for the demo data, used when Supabase auth is not available
// or does not know the account. Every sign-in form checks passwords here so a
// wrong password never falls through to someone else's account.

export const DEMO_TEACHER_ACCOUNTS = [
  { email: 'kasun.maths@lyntrix.learn', passwords: ['MasterKasun@2026', 'kasun123', '123456'], instructorId: 'ins-kasun-maths' },
  { email: 'danushka.physics@lyntrix.learn', passwords: ['MasterDanushka@2026', 'danushka123', '123456'], instructorId: 'ins-danushka-physics' },
  { email: 'dilshan.ict@lyntrix.learn', passwords: ['MasterDilshan@2026', 'dilshan123', '123456'], instructorId: 'ins-dilshan-ict' },
  { email: 'amila.chem@lyntrix.learn', passwords: ['MasterAmila@2026', 'amila123', '123456'], instructorId: 'ins-amila-chemistry' }
];

// Seeded students sign in with their email or index number.
const DEMO_STUDENT_PASSWORDS = {
  'std-8821': ['StudentNimesh@123', 'nimesh123']
};
const SHARED_STUDENT_PASSWORD = '123456';

const norm = (value) => (value || '').trim().toLowerCase();

// Returns { status: 'ok', instructor } | { status: 'wrong-password' } | { status: 'not-found' }
export const verifyTeacherLogin = (identifier, password, instructors) => {
  const id = norm(identifier);
  const pass = (password || '').trim();
  if (!id) return { status: 'not-found' };

  const demo = DEMO_TEACHER_ACCOUNTS.find(t => t.email === id);
  if (demo) {
    const instructor = instructors.find(i => i.id === demo.instructorId);
    if (!instructor) return { status: 'not-found' };
    return demo.passwords.includes(pass) ? { status: 'ok', instructor } : { status: 'wrong-password' };
  }

  // Teachers who signed up in this session.
  const instructor = instructors.find(i => norm(i.email) === id);
  if (!instructor) return { status: 'not-found' };
  return instructor.password && instructor.password === pass
    ? { status: 'ok', instructor }
    : { status: 'wrong-password' };
};

export const verifyStudentLogin = (identifier, password, students) => {
  const id = norm(identifier);
  const pass = (password || '').trim();
  if (!id) return { status: 'not-found' };

  const student = students.find(s => norm(s.email) === id || norm(s.indexNumber) === id);
  if (!student) return { status: 'not-found' };

  const allowed = student.password
    ? [student.password]
    : [...(DEMO_STUDENT_PASSWORDS[student.id] || []), SHARED_STUDENT_PASSWORD];
  return allowed.includes(pass) ? { status: 'ok', student } : { status: 'wrong-password' };
};

export const isTeacherIdentifier = (identifier, instructors) => {
  const id = norm(identifier);
  if (!id) return false;
  return DEMO_TEACHER_ACCOUNTS.some(t => t.email === id) || instructors.some(i => norm(i.email) === id);
};

export const findInstructorByEmail = (email, instructors) => {
  const id = norm(email);
  if (!id) return null;
  const demo = DEMO_TEACHER_ACCOUNTS.find(t => t.email === id);
  return instructors.find(i => (demo && i.id === demo.instructorId) || norm(i.email) === id) || null;
};
