export class CharMap {
  private charset: string;
  
  constructor(charset: string) {
    if(!charset || charset.length === 0) {
        throw new Error("charset cannot be empty");
    }
    this.charset = charset;
  }

  mapBrightness(value: number) {
    const index = Math.floor(
        (value / 255) * (this.charset.length - 1)
    );

    return this.charset[index];
  }
}