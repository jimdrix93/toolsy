import { Component } from "react";
import { I18nContext } from "../i18n";

export default class ErrorBoundary extends Component {
  static contextType = I18nContext;
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // opcional: enviar a analytics/logs
    // console.error("ErrorBoundary:", error, info);
  }
  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };
  render() {
    const { t } = this.context || { t: (k) => k };
    if (this.state.hasError) {
      return (
        <div className="container-site py-16">
          <div className="card p-6 space-y-3">
            <h1 className="text-2xl font-semibold text-[color:var(--brand)]">{t("error.title")}</h1>
            <p className="muted">{t("error.subtitle")}</p>
            <div className="flex gap-2">
              <button onClick={this.handleReload} className="btn-primary">{t("error.reload")}</button>
              <a
                href="https://github.com/jimdrix93/toolsy/issues"
                target="_blank"
                className="btn-outline"
              >
                {t("error.report")}
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
