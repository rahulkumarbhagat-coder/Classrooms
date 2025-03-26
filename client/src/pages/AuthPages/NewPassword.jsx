import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import loginImage from "./assets/login-image.png";
import logoImage from "./assets/logo.png";

function NewPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [email, setEmail] = useState('');

  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setError('Invalid or expired reset link');
        return;
      }

      const auth = getAuth();
      try {
        const email = await verifyPasswordResetCode(auth, oobCode);
        setEmail(email);
        setValidCode(true);
      } catch (error) {
        console.log(error);
        setError('Invalid or expired reset link');
      }
    };

    verifyCode();
  }, [oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPass) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const auth = getAuth();
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage('Password has been reset successfully! You can now login with your new password.');
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Login image taking up left half */}
      <img className="fixed left-0 top-0 w-1/2 h-screen object-cover" src={loginImage} alt="A scrabble board with the tiles arranged to spell 'Learn'" />

      {/* New password form taking up right half */}
      <div className="ml-[50%] h-screen bg-white w-1/2 px-6 py-6">
        {/* QuizCraft heading */}
        <div className="flex gap-3 my-3">
          <img src={logoImage} alt="logo" className="w-12 h-12 text-[#18981D] fill-curent"/>
          <h1 className="text-4xl font-bold text-[#18981D]">QuizCraft</h1>
        </div>

        <div className="w-1/2 justify-items-start mx-auto my-5">
          <div className="font-semibold justify-items-start text-3xl">
            <h3>Set New Password</h3>
          </div>
          <div className="text-gray-500 text-left">
            {validCode ? (
              <p>Create a new password for {email}</p>
            ) : (
              <p>Verifying your reset link...</p>
            )}
          </div>

          {validCode ? (
            <form className="w-full" onSubmit={handleSubmit}>
              {/* Password input */}
              <div className="flex flex-wrap -mx-3 my-4">
                <div className="w-full px-3 justify-items-start">
                  <label className="block tracking-wide text-gray-700 text-lg font-semibold mb-1" htmlFor="password">
                    New Password
                  </label>
                  <input 
                    className="block w-full text-gray-700 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                    style={{ 
                      boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                    }}
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength="6">
                  </input>
                </div>
              </div>

              {/* Confirm Password input */}
              <div className="flex flex-wrap -mx-3 my-4">
                <div className="w-full px-3 justify-items-start">
                  <label className="block tracking-wide text-gray-700 text-lg font-semibold mb-1" htmlFor="confirmPass">
                    Confirm Password
                  </label>
                  <input 
                    className="block w-full text-gray-700 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                    style={{ 
                      boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                    }}
                    id="confirmPass" 
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength="6">
                  </input>
                </div>
              </div>

              {message && <div className="text-green-600 mb-4">{message}</div>}
              {error && <div className="text-red-600 mb-4">{error}</div>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="block w-full text-xl text-white bg-[#18981D] py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline hover:bg-[#51CA58] hover:cursor-pointer"
                  style={{ 
                    boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                  }}>
                  {loading ? 'Setting Password...' : 'Set New Password'}
                </button>
              </div>

              <div className="flex items-center my-2 justify-center">
                <hr className="flex-grow border-t border-zinc-300" />
                <p className="mx-4 text-sm text-zinc-500">Or</p>
                <hr className="flex-grow border-t border-zinc-300" />
              </div>

              <Link
                to={"/login"}
                className="block w-full text-xl py-2 px-4 mb-3 rounded-xl focus:outline-none focus:shadow-outline hover:bg-[#51CA58] hover:text-white hover:cursor-pointer"
                style={{ 
                  boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                }}>
                Back to Login
              </Link>
            </form>
          ) : (
            <div className="my-6">
              {error && <div className="text-red-600 mb-4">{error}</div>}
              <Link
                to={"/login"}
                className="block w-full text-xl py-2 px-4 mb-3 rounded-xl focus:outline-none focus:shadow-outline hover:bg-[#51CA58] hover:text-white hover:cursor-pointer"
                style={{ 
                  boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                }}>
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewPassword;