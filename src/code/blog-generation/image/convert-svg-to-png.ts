import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";

const execFileAsync = promisify(execFile);

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
      `Inkscape Conversion Failed: Input file does not exist at "${inputPath}"`,
    );
  }

  let inkscapePath = "inkscape";
  if (process.platform === "darwin") {
    inkscapePath = "/Applications/Inkscape.app/Contents/MacOS/inkscape";
  } else if (process.platform === "win32") {
    inkscapePath = "C:\\Program Files\\Inkscape\\bin\\inkscape.exe";
  }

  const args: string[] = [inputPath, "--export-type=png", "-o", outputPath];

  if (options.width) args.push("-w", options.width.toString());
  if (options.height) args.push("-h", options.height.toString());

  try {
    const { stderr } = await execFileAsync(inkscapePath, args);

    if (!fs.existsSync(outputPath)) {
      throw new Error(
        `Inkscape process finished but output file was not created. Stderr: ${stderr}`,
      );
    }

    return { success: true, path: outputPath };
  } catch (error: any) {
    const errorMessage =
      error.stderr || error.message || "Unknown Inkscape Error";
    throw new Error(`Inkscape Conversion Failed: ${errorMessage}`);
  }
}

export default convertSvgToPng;
