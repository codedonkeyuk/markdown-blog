import fs from "node:fs";
import sharp from "sharp";
async function convertSvgToPng(inputPath, outputPath, options = {}) {
    if (!fs.existsSync(inputPath)) {
        throw new Error(`Sharp Conversion Failed: Input file does not exist at "${inputPath}"`);
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
    }
    catch (error) {
        const errorMessage = error.message || "Unknown Sharp Error";
        throw new Error(`Sharp Conversion Failed: ${errorMessage}`);
    }
}
export default convertSvgToPng;
//# sourceMappingURL=convert-svg-to-png.js.map