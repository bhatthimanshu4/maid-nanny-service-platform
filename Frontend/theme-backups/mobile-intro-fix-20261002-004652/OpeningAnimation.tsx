"use client";

import { useEffect, useState } from "react";

export default function OpeningAnimation() {
  const [phase, setPhase] = useState<"entering" | "leaving" | "done">("entering");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }

    const leaveTimer = window.setTimeout(() => setPhase("leaving"), 1150);
    const removeTimer = window.setTimeout(() => setPhase("done"), 1700);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`startup-intro${phase === "leaving" ? " startup-intro-leaving" : ""}`}
      role="status"
      aria-label="Welcome to Helper4U"
    >
      <div className="startup-intro-content">
        <div className="startup-intro-mark" aria-hidden="true">H</div>
        <p className="startup-intro-name">Helper4U</p>
        <p className="startup-intro-tagline">A little help goes a long way</p>
        <div className="startup-intro-loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
