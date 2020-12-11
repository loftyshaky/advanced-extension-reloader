import { CssVars as CssVarsShared } from '@loftyshaky/shared';

export class CssVars {
    private static i0: CssVars;

    public static get i() {
        if (!this.i0) { this.i0 = new this(); }

        return this.i0;
    }

    public set = (): void => err(() => {
        const roots = page === 'settings'
            ? [document.documentElement]
            : [];

        CssVarsShared.i.set_transition_vars(
            {
                roots,
                transition_duration: '200',
            },
        );
    },
    1011);
}
