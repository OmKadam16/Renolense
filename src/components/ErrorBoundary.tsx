import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f4faff] flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-lg border border-[#c2c8c5]/35 p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-xl font-extrabold text-[#051916] mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-2">
              An unexpected error occurred while rendering this page.
            </p>
            {this.state.error && (
              <p className="text-xs text-gray-400 mb-6 bg-gray-50 p-3 rounded-lg">
                An unexpected error occurred. Please reload the app and try again.
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#009bdc] hover:opacity-90 font-bold text-xs text-white shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
