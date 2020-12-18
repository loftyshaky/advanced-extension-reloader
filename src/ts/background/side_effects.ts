import { s_reload } from 'background/internal';

export class SideEffects {
    private static i0: SideEffects;

    public static get i() {
        if (!this.i0) { this.i0 = new this(); }

        return this.i0;
    }

    public react_to_change = () => err(() => { // react to settings change or extension reinstall/removal
        s_reload.ContextMenu.i.create();
        s_reload.Watch.i.connect();
    },
    1039);
}
