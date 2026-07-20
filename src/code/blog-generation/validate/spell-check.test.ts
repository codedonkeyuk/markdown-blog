import { test, describe, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";

// 1. Declare mock tracking tools globally
const mockSpellCheckDocument = mock.fn(async () => ({ issues: [] as any[] }));
const mockAsyncPool = mock.fn(
  async (items: any[], max: number, cb: Function) => {
    for (const item of items) {
      await cb(item);
    }
  },
);

// 2. Wrap mock configurations and function loading inside an async setup routine
async function initializeMocks() {
  mock.module("cspell-lib", {
    namedExports: {
      spellCheckDocument: mockSpellCheckDocument,
    },
  });

  mock.module("../thread-management/async-pool.ts", {
    defaultExport: mockAsyncPool,
  });

  mock.module("../../app-config.ts", {
    namedExports: {
      postSourcePath: "/mock/posts",
      maxParallelProcesses: 4,
    },
  });

  // Dynamic import forces Node's type stripper to load this file AFTER mocks take effect
  const module = await import("./spell-check.ts");
  const typesModule = await import("../types.ts");

  return {
    spellCheck: module.spellCheck,
    typePostInfo: typesModule as any,
  };
}

// 3. Destructure and prepare your isolated test target environment
const { spellCheck } = await initializeMocks();
type PostInfo = any;

describe("spellCheck Native TypeScript Unit Test", () => {
  let logCalls: any[][] = [];
  let errorCalls: any[][] = [];
  let exitCode: number | null = null;

  beforeEach(() => {
    logCalls = [];
    errorCalls = [];
    exitCode = null;

    mockAsyncPool.mock.resetCalls();
    mockSpellCheckDocument.mock.resetCalls();

    // Catch output pipelines cleanly
    mock.method(console, "log", (...args: any[]) => {
      logCalls.push(args);
    });
    mock.method(console, "error", (...args: any[]) => {
      errorCalls.push(args);
    });
    mock.method(process, "exit", (code: number) => {
      exitCode = code;
      throw new Error(`process.exit caught: ${code}`);
    });
  });

  afterEach(() => {
    mock.restoreAll();
  });

  test("should pass verification when no issues are found", async () => {
    const mockPosts = [{ directory: "post-1" }] as PostInfo[];
    mockSpellCheckDocument.mock.mockImplementation(async () => ({
      issues: [],
    }));

    await spellCheck(mockPosts);

    assert.equal(exitCode, null);
    assert.equal(mockAsyncPool.mock.callCount(), 1);
    assert.ok(
      logCalls.some((args) =>
        args.join(" ").includes("passed spelling verification"),
      ),
    );
  });

  test("should print detailed formatting and exit when spelling errors exist", async () => {
    const mockPosts = [{ directory: "post-2" }] as PostInfo[];
    const mockIssues = [
      {
        text: "mispeled",
        col: 5,
        line: {
          position: { line: 10 },
          offset: 100,
        },
        offset: 104,
        context: { text: "This is mispeled text" },
        suggestions: ["misspelled", "misspelt"],
      },
    ];

    mockSpellCheckDocument.mock.mockImplementation(async () => ({
      issues: mockIssues,
    }));

    await assert.rejects(
      async () => {
        await spellCheck(mockPosts);
      },
      (err: Error) => err.message === "process.exit caught: 1",
    );

    const errorsFlattened = errorCalls.map((args) => args.join(" ")).join("\n");

    assert.equal(exitCode, 1);
    assert.ok(
      errorsFlattened.includes(
        "Spelling validation failed with 1 total error(s)",
      ),
    );
    assert.ok(
      errorsFlattened.includes('[Line 11:5] ➜ Unknown word: "mispeled"'),
    );
    assert.ok(
      errorsFlattened.includes("Context: ... This is mispeled text ..."),
    );
    assert.ok(
      errorsFlattened.includes("Suggestions: [ misspelled, misspelt ]"),
    );
  });
});
