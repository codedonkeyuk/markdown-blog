import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import convertSvgToPng from "./convert-svg-to-png.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("convertSvgToPng Native Tests", () => {
  const staticSvgPath = path.join(__dirname, "convert-svg-to-png.test.svg");
  const outputPngPath = path.join(__dirname, "convert-svg-to-png.test.png");

  afterEach(() => {
    if (fs.existsSync(outputPngPath)) {
      fs.unlinkSync(outputPngPath);
    }
  });

  it("should successfully convert a valid SVG to PNG file format", async () => {
    const result = await convertSvgToPng(staticSvgPath, outputPngPath);
    assert.equal(result.success, true);
    assert.equal(result.path, outputPngPath);
    assert.equal(fs.existsSync(outputPngPath), true);
  });

  it("should successfully accept custom dimension options", async () => {
    const result = await convertSvgToPng(staticSvgPath, outputPngPath, {
      width: 300,
    });
    assert.equal(result.success, true);
    assert.equal(fs.existsSync(outputPngPath), true);
  });

  it("should throw an explicit error if the input SVG file does not exist", async () => {
    const invalidInputPath = path.join(__dirname, "does-not-exist.svg");

    await assert.rejects(async () => {
      await convertSvgToPng(invalidInputPath, outputPngPath);
    }, /Inkscape Conversion Failed: Input file does not exist/);
  });
});
