import liveServer from "live-server";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const customRoot = process.argv[2];

const params = {
  port: 3001,
  root: customRoot,
  open: true,
  middleware: [
    function (req: { url: string }, _: any, next: () => void) {
      const urlPath = req.url.split("?")[0];
      if (urlPath !== "/" && !path.extname(urlPath)) {
        const targetFile = path.resolve(customRoot, `${urlPath.slice(1)}.html`);

        if (fs.existsSync(targetFile)) {
          req.url = `${urlPath}.html`;
        }
      }
      next();
    },
  ],
};

liveServer.start(params);
