import React from 'react'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="auth-container animate-fade-in">
        <div className="auth-card-wrapper">
          <SignIn 
            signUpUrl="/signup" 
            forceRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "clerk-root",
                card: "clerk-card",
                headerTitle: "clerk-title",
                headerSubtitle: "clerk-subtitle",
                socialButtonsBlockButton: "clerk-social-button",
                formButtonPrimary: "clerk-submit-button",
                footerActionLink: "clerk-link",
                formFieldLabel: "clerk-label",
                formFieldInput: "clerk-input",
                dividerLine: "clerk-divider",
                dividerText: "clerk-divider-text"
              }
            }}
          />
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background-color: #0f0a1a;
        }

        .auth-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.15;
          filter: blur(40px);
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          background: #a855f7;
          top: -100px;
          right: -100px;
          animation: float 6s ease-in-out infinite;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          background: #7e22ce;
          bottom: -50px;
          left: -50px;
          animation: float 8s ease-in-out infinite reverse;
        }

        .shape-3 {
          width: 200px;
          height: 200px;
          background: #c084fc;
          top: 40%;
          left: 10%;
          animation: float 7s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        .auth-container {
          position: relative;
          z-index: 1;
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 2rem;
        }

        .auth-card-wrapper {
          width: 100%;
          max-width: 400px;
        }

        /* Clerk Overrides to match theme */
        .clerk-root {
          width: 100%;
        }

        .clerk-card {
          background: rgba(36, 21, 56, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(168, 85, 247, 0.3) !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 20px rgba(168, 85, 247, 0.2) !important;
        }

        .clerk-title {
          color: #e9d5ff !important;
          font-family: inherit !important;
        }

        .clerk-subtitle {
          color: #a1a1aa !important;
        }

        .clerk-social-button {
          background-color: rgba(30, 20, 50, 0.6) !important;
          border-color: rgba(168, 85, 247, 0.3) !important;
          color: #e9d5ff !important;
        }

        .clerk-submit-button {
          background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%) !important;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4) !important;
        }

        .clerk-label {
          color: #d1d5db !important;
        }

        .clerk-input {
          background-color: rgba(15, 10, 25, 0.6) !important;
          border-color: rgba(168, 85, 247, 0.2) !important;
          color: white !important;
        }

        .clerk-input:focus {
          border-color: #a855f7 !important;
          box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
        }

        .clerk-divider {
          background-color: rgba(168, 85, 247, 0.2) !important;
        }

        .clerk-divider-text {
          color: #71717a !important;
        }

        .clerk-link {
          color: #c084fc !important;
        }

        .clerk-link:hover {
          color: #a855f7 !important;
        }
      `}</style>
    </div>
  )
}

export default Login
