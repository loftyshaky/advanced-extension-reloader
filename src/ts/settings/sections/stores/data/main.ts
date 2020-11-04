import {
    Utils,
} from '@loftyshaky/shared';
import {
    o_inputs,
} from '@loftyshaky/shared/inputs';

export class Main {
    private static i0: Main;

    public static get i() {
        if (!this.i0) {
            this.i0 = new this();

            this.i0.sections = Utils.i.to_object({ arr: this.i0.sections });
            this.i0.sections.settings.inputs = Utils.i.to_object({
                arr: this.i0.sections.settings.inputs,
                section: 'settings',
            });
            this.i0.sections.links.inputs = Utils.i.to_object({
                arr: this.i0.sections.links.inputs,
                section: 'links',
            });
        }

        return this.i0;
    }

    public sections: any = [
        new o_inputs.Section({
            name: 'settings',
            inputs: [
                new o_inputs.Textarea({
                    name: 'click_action',
                    event_callback: () => null,
                }),
                new o_inputs.Textarea({
                    name: 'reload_actions',
                    event_callback: () => null,
                }),
            ],
        }),
        new o_inputs.Section({
            name: 'links',
            inputs: [new o_inputs.Textarea({
                name: 'click_action',
                event_callback: () => null,
            })],
        }),
    ]
}
