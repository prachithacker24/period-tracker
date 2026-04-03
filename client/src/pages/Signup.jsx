import React from 'react'
import { SignUp } from '@clerk/clerk-react'

const Signup = () => {
  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="auth-container animate-fade-in">
        <div className="auth-card-wrapper">
          <SignUp 
            signInUrl="/login" 
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
          padding: 2rem 0;
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
          background: var(--secondary-magenta);
          top: -100px;
          left: -100px;
          animation: float 6s ease-in-out infinite;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          background: var(--accent-magenta);
          bottom: -50px;
          right: -50px;
          animation: float 8s ease-in-out infinite reverse;
        }

        .shape-3 {
          width: 200px;
          height: 200px;
          background: var(--primary-lilac);
          top: 30%;
          right: 15%;
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
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(239, 71, 188, 0.15) !important;
          box-shadow: 0 10px 30px rgba(66, 13, 59, 0.05), 0 0 20px rgba(239, 71, 188, 0.1) !important;
        }

        .clerk-title {
          color: var(--text-dark) !important;
          font-family: inherit !important;
          font-weight: 800 !important;
        }

        .clerk-subtitle {
          color: var(--gray-500) !important;
        }

        .clerk-social-button {
          background-color: white !important;
          border-color: rgba(239, 71, 188, 0.2) !important;
          color: var(--text-dark) !important;
        }

        .clerk-submit-button {
          background: var(--accent-magenta) !important;
          box-shadow: 0 4px 12px rgba(239, 71, 188, 0.2) !important;
        }

        .clerk-label {
          color: var(--text-dark) !important;
          opacity: 0.8;
        }

        .clerk-input {
          background-color: rgba(255, 255, 255, 0.8) !important;
          border-color: rgba(239, 71, 188, 0.1) !important;
          color: var(--text-dark) !important;
        }

        .clerk-input:focus {
          border-color: var(--accent-magenta) !important;
          box-shadow: 0 0 0 2px rgba(239, 71, 188, 0.1) !important;
        }

        .clerk-divider {
          background-color: rgba(239, 71, 188, 0.1) !important;
        }

        .clerk-divider-text {
          color: var(--gray-500) !important;
        }

        .clerk-link {
          color: var(--accent-magenta) !important;
        }

        .clerk-link:hover {
          color: var(--text-dark) !important;
        }
      `}</style>
    </div>
  )
}

export default Signup
