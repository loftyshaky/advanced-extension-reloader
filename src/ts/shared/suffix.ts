export class Suffix {
    public suffix: string = 'u6Pgzb39sN0';
    private prefix: string;

    public constructor(prefix: string) {
        this.prefix = prefix;
    }

    public get result(): string {
        return `${this.prefix}_${this.suffix}`;
    }
}
