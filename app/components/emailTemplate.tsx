import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  otp: string;
}

export function EmailTemplate({ firstName, otp }: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#0f0f0f",
        padding: "40px",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          backgroundColor: "#141414",
          borderRadius: "12px",
          padding: "30px",
          border: "1px solid #2a2a2a",
        }}
      >
        <h1 style={{ color: "#1D9BF0", marginBottom: "10px" }}>
          FASTURL
        </h1>

        <p style={{ fontSize: "16px", color: "#cccccc" }}>
          Hello {firstName},
        </p>

        <p style={{ fontSize: "15px", color: "#aaaaaa", lineHeight: "1.6" }}>
          We received a request to verify your account. Use the OTP below to
          complete your verification.
        </p>

        <div
          style={{
            marginTop: "25px",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "18px 30px",
              fontSize: "26px",
              letterSpacing: "8px",
              fontWeight: "bold",
              backgroundColor: "#1e1e1e",
              border: "1px solid #333",
              borderRadius: "10px",
              color: "#ffffff",
            }}
          >
            {otp}
          </div>
        </div>

        <p style={{ fontSize: "13px", color: "#888" }}>
          This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.
        </p>

        <hr style={{ borderColor: "#2a2a2a", margin: "25px 0" }} />

        <p style={{ fontSize: "12px", color: "#666" }}>
          If you didn’t request this, you can safely ignore this email.
        </p>

        <p style={{ fontSize: "12px", color: "#666" }}>
          — Team FastURL 🚀
        </p>
      </div>
    </div>
  );
}