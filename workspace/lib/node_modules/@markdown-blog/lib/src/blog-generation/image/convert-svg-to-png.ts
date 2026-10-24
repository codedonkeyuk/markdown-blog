import fs from "node:fs";
import sharp from "sharp";

interface ConversionOptions {
  width?: number;
  height?: number;
}

interface ConversionResult {
  success: boolean;
  path: string;
}

async function convertSvgToPng(
  inputPath: string,
  outputPath: string,
  options: ConversionOptions = {},
): Promise<ConversionResult> {
  if (!fs.existsSync(inputPath)) {
    throw new Error(
      `Sharp Conversion Failed: Input file does not exist at "${inputPath}"`,
    );
  }

  try {
    let pipeline = sharp(inputPath);

    if (options.width || options.height) {
      pipeline = pipeline.resize({
        width: options.width,
        height: options.height,
        fit: "fill",
      });
    }

    await pipeline.flatten({ background: "#ffffff" }).png().toFile(outputPath);

    return { success: true, path: outputPath };
  } catch (error: any) {
    const errorMessage = error.message || "Unknown Sharp Error";
    throw new Error(`Sharp Conversion Failed: ${errorMessage}`);
  }
}

export default convertSvgToPng;
