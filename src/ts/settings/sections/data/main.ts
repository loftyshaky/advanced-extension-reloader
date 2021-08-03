import { makeObservable, computed } from 'mobx';

import { s_utils } from '@loftyshaky/shared';
import { o_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { d_settings } from '@loftyshaky/shared/settings';
import { d_sections } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            current_section: computed,
        });
    }

    public get current_section() {
        return n(data.settings.current_section) ? data.settings.current_section : 'all';
    }

    public sections: o_inputs.Section[] | i_inputs.Sections = [];

    public init_sections = (): void =>
        err(() => {
            this.sections = [
                ...[
                    new o_inputs.Section({
                        name: 'settings',
                        inputs: [
                            new o_inputs.Text({
                                name: 'ports',
                                include_help: true,
                                event_callback: d_sections.Val.i().change,
                                warn_state_checker: d_sections.Val.i().validate_input,
                            }),
                            new o_inputs.Textarea({
                                name: 'click_action',
                                include_help: true,
                                event_callback: d_sections.Val.i().change,
                                warn_state_checker: d_sections.Val.i().validate_input,
                            }),
                            new o_inputs.Textarea({
                                name: 'reload_actions',
                                include_help: true,
                                event_callback: d_sections.Val.i().change,
                                warn_state_checker: d_sections.Val.i().validate_input,
                            }),
                        ],
                    }),
                ],
                ...d_settings.Sections.i().make_shared_sections({
                    download_back_up_callback: ext.storage_get,
                    upload_back_up_callback: d_sections.Restore.i().restore_back_up,
                    restore_defaults_callback: () => d_sections.Restore.i().restore_confirm(),
                    input_change_val_callback: d_sections.Val.i().change,
                }),
                ...[
                    new o_inputs.Section({
                        name: 'links',
                        inputs: [
                            new o_inputs.Link({
                                name: 'privacy_policy',
                                href: 'https://bit.ly/extensions-privacy-policy',
                            }),
                            new o_inputs.Link({
                                name: 'rate',
                                browser: env.browser,
                                force_resolve: true,
                            }),
                            ...(env.browser === 'edge'
                                ? []
                                : [
                                      new o_inputs.Link({
                                          name: 'advanced_extension_reloader_for_chrome',
                                          browser: 'chrome',
                                      }),
                                      new o_inputs.Link({
                                          name: 'advanced_extension_reloader_for_edge',
                                          browser: 'edge',
                                      }),
                                  ]),
                            new o_inputs.Link({
                                name: 'facebook_page',
                                href: 'http://bit.ly/browservery',
                            }),
                            new o_inputs.Link({
                                name: 'support_page',
                                href: 'http://bit.ly/browservery-support',
                            }),
                        ],
                    }),
                ],
            ];

            this.sections = s_utils.Main.i().to_object({
                arr: this.sections as o_inputs.Section[],
            });
            this.sections.settings.inputs = s_utils.Main.i().to_object({
                arr: this.sections.settings.inputs as o_inputs.Section[],
                section: 'settings',
            });
            this.sections.links.inputs = s_utils.Main.i().to_object({
                arr: this.sections.links.inputs as o_inputs.Section[],
                section: 'links',
            });
        }, 'aer_1128');

    public change_section_val = (): void =>
        err(() => {
            data.settings.current_section = d_settings.Sections.i().current_section;

            ext.send_msg({
                msg: 'update_settings',
                settings: { current_section: d_settings.Sections.i().current_section },
            });
        }, 'aer_1129');
}