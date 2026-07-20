import test from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createMiddleware(mockDirname: string) {
  return function (req: { url: string }, _: any, next: () => void) {
    const urlPath = req.url.split("?")[0];
    if (urlPath !== "/" && !path.extname(urlPath)) {
      const targetFile = path.join(mockDirname, "src/site", `${urlPath}.html`);

      if (fs.existsSync(targetFile)) {
        req.url = `${urlPath}.html`;
      }
    }
    next();
  };
}

test("Live Server Middleware Tests", async (t) => {
  const tempDir = path.join(__dirname, "temp-test-site");
  const siteDir = path.join(tempDir, "src", "site");

  fs.mkdirSync(siteDir, { recursive: true });
  fs.writeFileSync(path.join(siteDir, "about.html"), "<h1>About</h1>");

  const middleware = createMiddleware(tempDir);

  await t.test(
    "should append .html if file exists and has no extension",
    () => {
      const req = { url: "/about" };
      let nextCalled = false;

      middleware(req, {}, () => {
        nextCalled = true;
      });

      assert.strictEqual(req.url, "/about.html");
      assert.strictEqual(nextCalled, true);
    },
  );

  await t.test("should not change url if file does not exist", () => {
    const req = { url: "/contact" }; // contact.html doesn't exist
    let nextCalled = false;

    middleware(req, {}, () => {
      nextCalled = true;
    });

    assert.strictEqual(req.url, "/contact");
    assert.strictEqual(nextCalled, true);
  });

  await t.test("should ignore root path '/'", () => {
    const req = { url: "/" };
    let nextCalled = false;

    middleware(req, {}, () => {
      nextCalled = true;
    });

    assert.strictEqual(req.url, "/");
    assert.strictEqual(nextCalled, true);
  });

  await t.test("should strip query parameters and evaluate correctly", () => {
    const req = { url: "/about?ref=homepage" };
    let nextCalled = false;

    middleware(req, {}, () => {
      nextCalled = true;
    });

    assert.strictEqual(req.url, "/about.html");
    assert.strictEqual(nextCalled, true);
  });

  t.after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
