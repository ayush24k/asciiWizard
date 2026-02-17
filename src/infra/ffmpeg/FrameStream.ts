import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";

export interface FrameStreamOptions {
    path: string;
    width: number;
    fps: number;
}


export function createFrameStream(
    options: FrameStreamOptions
): Readable {

    const { path, width, fps } = options;

    const stream = new Readable().wrap(
        (ffmpeg(path)
            .outputOptions([
                "-vf",
                `fps=${fps},scale=${width}:-1,format=gray`,
                "-f rawvideo",
                "-pix_fmt gray"
            ])
            .format("rawvideo")
            .pipe() as unknown) as Readable
    );

    return stream;
}

