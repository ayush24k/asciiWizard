import sharp from "sharp";

export interface ProcessedImage {
    data: Uint8Array;
    width: number;
    height: number;
}

export class ImageProcessor {
    async loadGrayscale(
        path: string,
        width: number
    ): Promise<ProcessedImage> {
        const image = sharp(path).resize({ width, height: Math.floor(width * 0.55), fit: "inside" })


        const { data, info } = await image
            .raw()
            .toBuffer({ resolveWithObject: true });


        // data is RGB even in grayscale → take one channel
        const grayscale = new Uint8Array(info.width * info.height);

        for (let i = 0; i < grayscale.length; i++) {
            grayscale[i] = data[i * info.channels]!;
        }

        return {
            data: grayscale,
            width: info.width,
            height: info.height
        };
    }
}
