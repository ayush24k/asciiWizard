export function validateWidth(width?: number) {
    if (!width) return;
    if (isNaN(width) || width < 10 || width > 500) {
        throw new Error("Width must be between 10 and 500");
    }
}

export function validateFPS(fps?: number) {
    if (!fps) return;

    if (isNaN(fps) || fps < 1 || fps > 60) {
        throw new Error("FPS must be between 1 and 60");
    }
}
