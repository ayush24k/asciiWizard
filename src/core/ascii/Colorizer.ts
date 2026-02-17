import chalk from "chalk";

export interface ColorOptions {
    fg?: string;
    bg?: string;
}

export class Colorizer {
    private fg: string | undefined;
    private bg: string | undefined;

    constructor(options: ColorOptions = {}) {
        this.fg = options.fg;
        this.bg = options.bg;
    }

    apply(text: string): string {
        let styled: any = chalk;

        if (this.fg && styled[this.fg]) {
            styled = styled[this.fg];
        }

        if (this.bg) {
            const bgKey =
                "bg" + this.bg.charAt(0).toUpperCase() + this.bg.slice(1);

            if (styled[bgKey]) {
                styled = styled[bgKey];
            }
        }

        return typeof styled === "function" ? styled(text) : text;
    }
}
