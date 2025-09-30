// Local storage keys for interview app authentication
export const STORAGE_KEYS = {
  USERS: 'interview_app_users',
  CURRENT_USER: 'interview_app_current_user',
  REMEMBER_ME: 'interview_app_remember_me',
  SESSION_TIMEOUT: 'interview_app_session_timeout'
};

// Default session timeout (24 hours in milliseconds)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

/**
 * Get all registered users from localStorage
 * @returns {Array} Array of user objects
 */
export const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS?.USERS) || '[]');
  } catch (error) {
    console.error('Error parsing users from localStorage:', error);
    return [];
  }
};

/**
 * Save users array to localStorage
 * @param {Array} users - Array of user objects
 */
export const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS?.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

/**
 * Get current authenticated user
 * @returns {Object|null} Current user object or null
 */
export const getCurrentUser = () => {
  try {
    const currentUser = localStorage.getItem(STORAGE_KEYS?.CURRENT_USER);
    if (!currentUser) return null;

    const user = JSON.parse(currentUser);
    
    // Check session timeout
    if (isSessionExpired(user)) {
      clearCurrentUser();
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    clearCurrentUser();
    return null;
  }
};

/**
 * Set current authenticated user
 * @param {Object} user - User object
 */
export const setCurrentUser = (user) => {
  try {
    const sessionData = {
      ...user,
      loginTime: new Date()?.toISOString(),
      sessionId: `SES-${Date.now()}`
    };
    localStorage.setItem(STORAGE_KEYS?.CURRENT_USER, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

/**
 * Clear current user session
 */
export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS?.CURRENT_USER);
};

/**
 * Check if user session has expired
 * @param {Object} user - User object with loginTime
 * @returns {boolean} True if session expired
 */
export const isSessionExpired = (user) => {
  if (!user?.loginTime) return true;
  
  try {
    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const timeDiff = now - loginTime;
    
    return timeDiff > SESSION_TIMEOUT;
  } catch (error) {
    console.error('Error checking session expiration:', error);
    return true;
  }
};

/**
 * Authenticate user credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (candidate/interviewer)
 * @returns {Object|null} User object if authenticated, null otherwise
 */
export const authenticateUser = (email, password, role) => {
  const users = getUsers();
  return users?.find(user => 
    user?.email?.toLowerCase() === email?.toLowerCase() && 
    user?.password === password && 
    user?.role === role &&
    user?.isActive !== false
  ) || null;
};

/**
 * Check if email already exists
 * @param {string} email - Email to check
 * @returns {boolean} True if email exists
 */
export const emailExists = (email) => {
  const users = getUsers();
  return users?.some(user => user?.email?.toLowerCase() === email?.toLowerCase());
};

/**
 * Create new user account
 * @param {Object} userData - User data object
 * @returns {Object} Created user object
 */
export const createUser = (userData) => {
  const users = getUsers();
  
  const newUser = {
    id: `user_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`,
    fullName: userData?.fullName?.trim(),
    email: userData?.email?.trim()?.toLowerCase(),
    password: userData?.password, // In production, this should be hashed
    role: userData?.role,
    phone: userData?.phone?.trim() || null,
    linkedIn: userData?.linkedIn?.trim() || null,
    company: userData?.company?.trim() || null,
    department: userData?.department?.trim() || null,
    createdAt: new Date()?.toISOString(),
    isActive: true,
    lastLoginAt: null
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  
  return newUser;
};

/**
 * Update user's last login time
 * @param {string} userId - User ID
 */
export const updateLastLogin = (userId) => {
  const users = getUsers();
  const updatedUsers = users?.map(user => 
    user?.id === userId 
      ? { ...user, lastLoginAt: new Date()?.toISOString() }
      : user
  );
  saveUsers(updatedUsers);
};

/**
 * Get/Set remember me preference
 */
export const getRememberMe = () => {
  try {
    const remembered = localStorage.getItem(STORAGE_KEYS?.REMEMBER_ME);
    return remembered ? JSON.parse(remembered) : null;
  } catch (error) {
    console.error('Error getting remember me data:', error);
    return null;
  }
};

export const setRememberMe = (email, role) => {
  try {
    localStorage.setItem(STORAGE_KEYS?.REMEMBER_ME, JSON.stringify({ email, role }));
  } catch (error) {
    console.error('Error setting remember me data:', error);
  }
};

export const clearRememberMe = () => {
  localStorage.removeItem(STORAGE_KEYS?.REMEMBER_ME);
};

/**
 * Initialize demo users for testing (call once on app start)
 */
export const initializeDemoUsers = () => {
  const existingUsers = getUsers();
  
  // Only initialize if no users exist
  if (existingUsers?.length === 0) {
    const demoUsers = [
      {
        id: 'demo_candidate_1',
        fullName: 'John Candidate',
        email: 'candidate@demo.com',
        password: 'password123',
        role: 'candidate',
        phone: '+1-555-0123',
        linkedIn: 'https://linkedin.com/in/johncandidate',
        company: null,
        department: null,
        createdAt: new Date()?.toISOString(),
        isActive: true,
        lastLoginAt: null
      },
      {
        id: 'demo_interviewer_1',
        fullName: 'Jane Interviewer',
        email: 'interviewer@demo.com',
        password: 'password123',
        role: 'interviewer',
        phone: '+1-555-0124',
        linkedIn: null,
        company: 'Tech Corp Inc',
        department: 'Human Resources',
        createdAt: new Date()?.toISOString(),
        isActive: true,
        lastLoginAt: null
      }
    ];
    
    saveUsers(demoUsers);
    console.log('Demo users initialized for testing');
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Strength score and feedback
 */
export const validatePasswordStrength = (password) => {
  const strength = {
    score: 0,
    feedback: []
  };

  if (!password) return strength;

  if (password?.length >= 8) {
    strength.score += 1;
  } else {
    strength?.feedback?.push('At least 8 characters');
  }

  if (/[A-Z]/?.test(password)) {
    strength.score += 1;
  } else {
    strength?.feedback?.push('One uppercase letter');
  }

  if (/[a-z]/?.test(password)) {
    strength.score += 1;
  } else {
    strength?.feedback?.push('One lowercase letter');
  }

  if (/\d/?.test(password)) {
    strength.score += 1;
  } else {
    strength?.feedback?.push('One number');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/?.test(password)) {
    strength.score += 1;
  } else {
    strength?.feedback?.push('One special character');
  }

  return strength;
};

/**
 * Generate secure session ID
 * @returns {string} Session ID
 */
export const generateSessionId = () => {
  return `SES_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 12)}`;
};

/**
 * Logout current user
 */
export const logout = () => {
  clearCurrentUser();
  clearRememberMe();
};

/**
 * Get user role-based redirect path
 * @param {string} role - User role
 * @returns {string} Redirect path
 */
export const getRoleRedirectPath = (role) => {
  switch (role) {
    case 'interviewer':
      return '/interviewer-dashboard';
    case 'candidate':
    default:
      return '/resume-upload';
  }
};