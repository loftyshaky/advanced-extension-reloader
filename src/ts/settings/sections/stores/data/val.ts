import {
    configure,
    action,
} from 'mobx';

import {
    i_inputs,
} from '@loftyshaky/shared/inputs';
import { d_sections } from 'settings/internal';

configure({ enforceActions: 'observed' });

export class Val {
    private static i0: Val;

    public static get i() {
        this.i0 = new this();

        return this.i0;
    }

    public change = (
        {
            input,
        }: {
            input: i_inputs.Input;
        },
    ): void => err(() => {
        ext.storage_set({ [input.name]: input.val });
    },
    1014);

    public set_on_page_load = (): Promise<void> => err_async(async () => {
        const settings = await ext.storage_get();

        Object.entries(settings).forEach(action(([
            key,
            val,
        ]) => {
            d_sections.Main.i.sections.settings.inputs[key].val = val;
        }));
    },
    1015);
}
