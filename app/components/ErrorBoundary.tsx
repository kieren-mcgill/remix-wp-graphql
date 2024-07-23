import {isRouteErrorResponse, useRouteError} from "@remix-run/react";

const ErrorBoundary = () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div className="error-container">
                <h1>{error.status}</h1>
                <p>{error.statusText}</p>
                {error.data?.message && <p>{error.data.message}</p>}
            </div>
        );
    }

    return (
        <div className="error-container">
            <h1>Something went wrong</h1>
            <pre>{error.message}</pre>
        </div>
    );
}

export default ErrorBoundary;