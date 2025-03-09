import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-container">
                    <h1>Something went wrong</h1>
                    <p>{this.state.error?.message}</p>
                </div>
            );
        }

        return this.props.children;
    }
}