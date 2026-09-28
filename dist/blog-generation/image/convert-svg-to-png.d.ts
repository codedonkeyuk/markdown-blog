interface ConversionOptions {
    width?: number;
    height?: number;
}
interface ConversionResult {
    success: boolean;
    path: string;
}
declare function convertSvgToPng(inputPath: string, outputPath: string, options?: ConversionOptions): Promise<ConversionResult>;
export default convertSvgToPng;
