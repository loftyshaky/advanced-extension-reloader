import type { Management } from 'webextension-polyfill';

import type { t } from '@loftyshaky/shared/shared_clean';
import type { i_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public allowed_advanced_extension_reloader_ids: string[] = [
        'hmhmmmajoblhmohkmfjeoamhdpodihlg',
        'hagknokdofkmojolcpbddjfdjhnjdkae',
        'bcpgohifjmmcoiemghdamamlkbcbgifg',
        'advanced-extension-reloader@loftyshaky',
    ];

    public get_extension_reload_eligibility = ({
        extension_id,
        ext_info,
        settings,
    }: {
        extension_id?: string;
        ext_info?: Management.ExtensionInfo;
        settings?: i_data.Settings;
    } = {}): Promise<boolean> =>
        err_async(async (): Promise<boolean> => {
            const get_extension_reload_eligibility_inner = ({
                ext_info_2,
                settings_2,
            }: {
                ext_info_2: Management.ExtensionInfo;
                settings_2: t.AnyRecord;
            }): Promise<void> =>
                err_async(async () => {
                    const extension_id_option_specified = typeof extension_id === 'string';
                    const matched_extension_id_from_options = ext_info_2.id === extension_id;
                    const is_specified_in_options_extension: boolean =
                        ext_info_2.id !== we.runtime.id &&
                        ext_info_2.enabled &&
                        ext_info_2.installType === 'development' &&
                        ((ext_info_2.type === 'theme' && settings_2.prefs.allow_theme_reload) ||
                            ext_info_2.type !== 'theme') &&
                        (!extension_id_option_specified || matched_extension_id_from_options);

                    if (is_specified_in_options_extension) {
                        extension_is_eligible_for_reload = true;
                    }
                }, 'aer_1112');

            let extension_is_eligible_for_reload = false;

            if (n(ext_info) && n(settings)) {
                await get_extension_reload_eligibility_inner({
                    ext_info_2: ext_info,
                    settings_2: settings,
                });
            } else {
                const settings_2: i_data.Settings =
                    env.browser === 'firefox'
                        ? ((await ext.storage_get()) as i_data.Settings)
                        : ((await ext.send_msg_resp({
                              msg: 'get_settings',
                          })) as i_data.Settings);
                const exts: Management.ExtensionInfo[] =
                    env.browser === 'firefox'
                        ? await we.management.getAll()
                        : ((await ext.send_msg_resp({
                              msg: 'get_all_extensions',
                          })) as Management.ExtensionInfo[]);

                await Promise.all(
                    exts.map(async (ext_info_2: Management.ExtensionInfo) =>
                        err_async(async (): Promise<void> => {
                            await get_extension_reload_eligibility_inner({
                                ext_info_2,
                                settings_2,
                            });
                        }, 'aer_1111'),
                    ),
                );
            }

            return extension_is_eligible_for_reload;
        }, 'aer_1110');
}

export const Watch = Class.get_instance();
