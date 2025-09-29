// src/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("[App ErrorBoundary]", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, maxWidth: 720, margin: "24px auto",
                      border: "1px solid #fecaca", background: "#fff1f2",
                      borderRadius: 8, color: "#7f1d1d", fontFamily: "system-ui, sans-serif" }}>
          <h2 style={{ margin: 0, fontWeight: 700 }}>App crashed</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(this.state.error)}</pre>
          <p style={{ marginTop: 8 }}>Open the browser console for a full stack trace.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
