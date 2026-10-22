import { createServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rawRoot = process.argv[2] || ".";
const customRoot = path.resolve(process.cwd(), rawRoot);
async function startServer() {
    const server = await createServer({
        root: customRoot,
        server: {
            port: 3001,
            open: true,
        },
    });
    await server.listen();
    server.printUrls();
}
startServer().catch((err) => {
    console.error("Failed to start Vite server:", err);
    process.exit(1);
});
//# sourceMappingURL=app.js.map