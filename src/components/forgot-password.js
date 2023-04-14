import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/AuthenticationService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isCodeVerified) {
        await authService.verifyCode(email, verificationCode);
        console.log("Code verified successfully.");
        setIsCodeVerified(true);
      }
    } catch (error) {
      console.log("An error occurred while verifying the code.");
      console.log(error);
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await authService.sendVerificationCode(email);
      console.log("Verification code sent successfully.");
      setIsCodeSent(true);
    } catch (error) {
      console.log("An error occurred while sending the verification code.");
      console.log(error);
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match.");
      return;
    }
    try {
      await authService.resetPassword(email, newPassword, confirmPassword);
      console.log("Password reset successfully.");
    } catch (error) {
      console.log("An error occurred while resetting the password.");
      console.log(error);
    }
  };
  

  return (
    <div className="card card-container">
      <div className="forgot-password">
        <h2>Forgot Password</h2>
        <form>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!isCodeVerified && isCodeSent && (
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
          )}

          {!isCodeSent && (
            <button type="submit" className="btn btn-primary btn-block" onClick={handleSendCode}>
              Send Verification Code
            </button>
          )}

          {isCodeVerified && (
            <>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {isCodeSent && !isCodeVerified && (
            <button type="submit" className="btn btn-primary btn-block" onClick={handleSubmit}>
              Verify Code
            </button>
          )}

          {isCodeVerified && (
            <button type="submit" className="btn btn-primary btn-block" onClick={handleResetPassword}>
              Reset Password
            </button>
          )}
        </form>

        <div className="mt-3">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
