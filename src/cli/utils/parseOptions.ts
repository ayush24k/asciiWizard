import { defaultConfig } from "../../config/defaultConfig";

export function parseCommonOptions(options: any) {
    return {
        width: options.width ? Number(options.width) : (defaultConfig.width ?? 100),
        fps: options.fps ? Number(options.fps) : (defaultConfig.fps ?? 24),
        charset: options.charset || defaultConfig.charset || "",
        ...(options.color || defaultConfig.color ? { color: options.color || defaultConfig.color } : {}),
        ...(options.bg || defaultConfig.background ? { background: options.bg || defaultConfig.background } : {})
    };
}
