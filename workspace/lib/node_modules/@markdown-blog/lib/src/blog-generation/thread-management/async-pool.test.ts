import { test, describe } from "node:test";
import assert from "node:assert";
import asyncPool from "./async-pool.ts";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("asyncPool Utility", () => {
  test("should process all items and return correct mapped results", async () => {
    const input = [1, 2, 3, 4, 5];

    const result = await asyncPool(input, 2, async (num: number) => {
      await delay(10);
      return num * num;
    });

    assert.deepStrictEqual(result, [1, 4, 9, 16, 25]);
  });

  test("should enforce the concurrency limit strictly", async () => {
    const input = [1, 2, 3, 4, 5];
    const concurrencyLimit = 2;

    let currentlyRunning = 0;
    let maxObservedConcurrency = 0;

    await asyncPool(input, concurrencyLimit, async (item) => {
      currentlyRunning++;

      if (currentlyRunning > maxObservedConcurrency) {
        maxObservedConcurrency = currentlyRunning;
      }

      await delay(15);
      currentlyRunning--;
    });

    assert.ok(
      maxObservedConcurrency <= concurrencyLimit,
      `Max concurrency leaked to ${maxObservedConcurrency}`,
    );
    assert.strictEqual(maxObservedConcurrency, concurrencyLimit);
  });

  test("should propagate errors immediately and stop further processing", async () => {
    const input = ["fine", "fine", "broken", "fine"];

    const executionPromise = asyncPool(input, 1, async (status) => {
      if (status === "broken") {
        throw new Error("Simulated disk failure");
      }
      return status;
    });

    await assert.rejects(executionPromise, {
      message: "Simulated disk failure",
    });
  });
});
