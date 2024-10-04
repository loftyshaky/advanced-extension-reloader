import { makeObservable, computed } from 'mobx';

import { s_utils } from '@loftyshaky/shared/shared';
import { o_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { d_sections as d_sections_loftyshaky_settings } from '@loftyshaky/shared/settings';
import { d_data, d_sections } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            current_section: computed,
        });
    }

    public get current_section() {
        return n(data.settings.prefs.current_section)
            ? data.settings.prefs.current_section
            : 'reload';
    }

    public sections: o_inputs.Section[] | i_inputs.Sections = [];

    public init = (): void =>
        err(() => {
            this.sections = [
                ...[
                    new o_inputs.Section({
                        name: 'reload',
                        inputs: [
                            new o_inputs.Textarea({
                                name: 'ports',
                                val_accessor: 'ui.ports',
                                include_help: true,
                                input_errors: ['invalid_ports'],
                                event_callback: d_sections.Val.change,
                                warn_state_checker: d_sections.Validation.validate_input,
                            }),
                            new o_inputs.Textarea({
                                name: 'click_action',
                                val_accessor: 'ui.click_action',
                                include_help: true,
                                alt_help_msg: ext.msg(`click_action_help_text_${env.browser}`),
                                input_errors: ['invalid_reload_action'],
                                event_callback: d_sections.Val.change,
                                warn_state_checker: d_sections.Validation.validate_input,
                            }),
                            new o_inputs.Textarea({
                                name: 'context_menu_actions',
                                val_accessor: 'ui.context_menu_actions',
                                include_help: true,
                                alt_help_msg: ext.msg(
                                    `context_menu_actions_help_text_${env.browser}`,
                                ),
                                input_errors: ['invalid_reload_action'],
                                event_callback: d_sections.Val.change,
                                warn_state_checker: d_sections.Validation.validate_input,
                            }),
                            new o_inputs.Range({
                                name: 'reload_notification_volume',
                                max: 1,
                                step: 0.01,
                                event_callback: d_sections.Val.change,
                            }),
                        ],
                    }),
                    new o_inputs.Section({
                        name: 'docs',
                        inputs: [
                            new o_inputs.Link({
                                name: 'docs',
                            }),
                        ],
                    }),
                ],
                ...d_sections_loftyshaky_settings.Sections.make_shared_sections({
                    download_back_up_callback: ext.storage_get,
                    upload_back_up_callback: d_sections.Restore.restore_back_up,
                    restore_defaults_callback: () => d_sections.Restore.restore_confirm(),
                    input_change_val_callback: d_sections.Val.change,
                    admin_inputs: [
                        new o_inputs.Checkbox({
                            name: 'allow_theme_reload',
                            event_callback: d_sections.Val.change,
                        }),
                    ],
                }),
                ...[
                    new o_inputs.Section({
                        name: 'links',
                        inputs: [
                            new o_inputs.Link({
                                name: 'docs',
                            }),
                            new o_inputs.Link({
                                name: 'privacy_policy',
                                href: ext.msg('privacy_policy_link_href'),
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
                                          name: 'advanced_extension_reloaderi1i',
                                          browser: 'chrome',
                                      }),
                                      new o_inputs.Link({
                                          name: 'advanced_extension_reloaderi2i',
                                          browser: 'edge',
                                      }),
                                  ]),
                            new o_inputs.Link({
                                name: 'github',
                            }),
                            new o_inputs.Link({
                                name: 'facebook_page',
                                href: ext.msg('facebook_page_link_href'),
                            }),
                            new o_inputs.Link({
                                name: 'support_page',
                                href: ext.msg('support_page_link_href'),
                            }),
                            ...(env.browser === 'edge'
                                ? []
                                : [
                                      new o_inputs.Link({
                                          name: 'dependencies',
                                          href: ext.msg('dependencies_link_href'),
                                      }),
                                  ]),
                        ],
                    }),
                ],
            ];

            this.sections = s_utils.Utils.to_object({
                arr: this.sections as o_inputs.Section[],
            });
            this.sections.restore.inputs = s_utils.Utils.to_object({
                arr: this.sections.restore.inputs as o_inputs.Section[],
            });
            this.sections.admin.inputs = s_utils.Utils.to_object({
                arr: this.sections.admin.inputs as o_inputs.Section[],
            });
            this.sections.reload.inputs = s_utils.Utils.to_object({
                arr: this.sections.reload.inputs as o_inputs.Section[],
                section: 'reload',
            });
            this.sections.links.inputs = s_utils.Utils.to_object({
                arr: this.sections.links.inputs as o_inputs.Section[],
                section: 'links',
            });
        }, 'aer_1047');

    public change_current_section_val = (): void =>
        err(() => {
            data.settings.prefs.current_section =
                d_sections_loftyshaky_settings.Sections.current_section;

            d_data.Manipulation.send_msg_to_update_settings({
                settings: {
                    prefs: {
                        ...data.settings.prefs,
                        current_section: d_sections_loftyshaky_settings.Sections.current_section,
                    },
                },
                update_instantly: true,
            });
        }, 'aer_1048');
}

export const Sections = Class.get_instance();
