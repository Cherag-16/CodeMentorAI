import { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from '../firebase';

function AuthPage({ navigate }) {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loginData, setLoginData] = useState({ 
    email: '', 
    password: '' 
  });
  const [tab, setTab] = useState('signup');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e, isLogin = false) => {
    const data = isLogin ? loginData : formData;
    const setData = isLogin ? setLoginData : setFormData;
    setData({ ...data, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignup = async () => {
    setError('');
    setLoading(true);
    const { username, email, password, confirmPassword } = formData;

    // Form validation
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      
      // Update profile with username
      await updateProfile(userCredential.user, {
        displayName: username
      });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
        createdAt: new Date().toISOString()
      });
      
      setError('Signup successful. Please login.');
      setTab('login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const { email, password } = loginData;

    if (!email || !password) {
      setError('Both fields are required.');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-white">
        <div className="p-6">
          <div className="w-full">
            <div className="grid w-full grid-cols-2 mb-4 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`py-2 px-4 rounded-md ${tab === 'login' ? 'bg-white shadow-sm' : ''}`}
              >
                Login
              </button>
              <button
                onClick={() => { setTab('signup'); setError(''); }}
                className={`py-2 px-4 rounded-md ${tab === 'signup' ? 'bg-white shadow-sm' : ''}`}
              >
                Sign Up
              </button>
            </div>
            
            {error && (
              <div className={`mb-4 text-sm text-center p-2 rounded ${
                error === 'Signup successful. Please login.' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
              }`}>
                {error}
              </div>
            )}
            
            {tab === 'login' && (
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => handleChange(e, true)}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => handleChange(e, true)}
                  className="w-full p-2 border rounded-md"
                />
                <button 
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            )}
            
            {tab === 'signup' && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => handleChange(e)}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleChange(e)}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange(e)}
                  className="w-full p-2 border rounded-md"
                />
                <button 
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;