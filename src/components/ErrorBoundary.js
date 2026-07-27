import { Component } from "react";

// Catches render-time exceptions anywhere below it and shows a friendly
// fallback instead of a blank white screen. Error boundaries must be class
// components (there is no hook equivalent for componentDidCatch).
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unexpected UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="default-sky">
          <section className="weather-section" role="alert">
            <h3>Something went wrong</h3>
            <p>The app hit an unexpected error. Reloading usually fixes it.</p>
            <button type="button" onClick={() => window.location.reload()}>
              Reload
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
