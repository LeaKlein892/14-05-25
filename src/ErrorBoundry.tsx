import React, { ErrorInfo, ReactNode } from "react";
import { FriendlyError } from "./components/friendly-error/FriendlyError";
import { analyticsError } from "./utils/analytics";

interface ErrorBoundaryState {
  hasError: boolean;
  previousContent: ReactNode | null;
  removeChildError: boolean;
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      previousContent: null,
      removeChildError: false,
    };
  }

  static getDerivedStateFromError(error: Error) {
    if (error.message.includes("Failed to execute 'removeChild' on 'Node'")) {
      return { hasError: true, removeChildError: true };
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.message.includes("Failed to execute 'removeChild' on 'Node'")) {
      this.setState({ removeChildError: true });
      analyticsError(
        "Failed to switch Floor/Building/Date. errorMessage:" + error.message
      );
    } else {
      analyticsError(
        "Unexpected error occurred caught by error boundry. error message:" +
          error.message
      );
    }
    this.setState({ hasError: true });
  }

  render() {
    return (
      <div>
        {this.state.hasError ? (
          <div>
            {this.state.removeChildError ? (
              <FriendlyError
                link="/project"
                message="navigation failed, return to project."
                linkText="Projects"
              />
            ) : (
              <FriendlyError
                link="/project"
                message="an unexpected error occurred, please return to main page."
                linkText="Projects"
              />
            )}
          </div>
        ) : (
          this.props.children
        )}
      </div>
    );
  }

  componentDidUpdate(prevProps: {}, prevState: ErrorBoundaryState) {
    if (!prevState.hasError && this.state.hasError) {
      this.setState({
        previousContent: prevState.previousContent || this.props.children,
      });
    }
  }
}
