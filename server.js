import { createRequestHandler } from "@remix-run/express";
import express from "express";
import helmet from "helmet";

const viteDevServer =
    process.env.NODE_ENV === "production"
        ? null
        : await import("vite").then((vite) =>
            vite.createServer({
                server: { middlewareMode: true },
            })
        );

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", "https:"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        frameguard: {
            action: 'deny',
        },
        // Add other Helmet configurations as needed
    })
);

app.use(
    viteDevServer
        ? viteDevServer.middlewares
        : express.static("build/client")
);

const build = viteDevServer
    ? () =>
        viteDevServer.ssrLoadModule(
            "virtual:remix/server-build"
        )
    : await import("./build/server/index.js");

app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
    console.log("App listening on http://localhost:3000");
});
