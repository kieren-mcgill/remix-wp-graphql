import {Links, Meta, Scripts} from "@remix-run/react";
import React from "react";

const ErrorBoundaryComponent = ({error}) => {

        return (
            <html>
            <head>
                <title>Oh no!</title>
                <Meta />
                <Links />
            </head>
            <body>
            <h1>{error.status}</h1>
            <Scripts />
            </body>
            </html>
        )

}

export default ErrorBoundaryComponent;