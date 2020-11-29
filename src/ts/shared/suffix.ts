import { CssVars } from '@loftyshaky/shared';

export class Suffix {
    public suffix: string = '';
    private prefix: string;

    public constructor(prefix: string) {
        this.suffix = CssVars.i.get({ name: 'app_id' });
        this.prefix = prefix;
    }

    public get result(): string {
        return `${this.prefix}_${this.suffix}`;
    }
}
