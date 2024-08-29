import { Management } from 'webextension-polyfill';

import { i_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public extension_is_eligible_for_reload = ({
        ext_id,
        ext_info,
        settings,
    }: {
        ext_id?: string;
        ext_info?: Management.ExtensionInfo;
        settings?: i_data.Settings;
    } = {}): Promise<boolean> =>
        err_async(async (): Promise<boolean> => {
            const extension_is_eligible_for_reload_inner = ({
                ext_info_2,
                settings_2,
            }: {
                ext_info_2: Management.ExtensionInfo;
                settings_2: any;
            }): void =>
                err(() => {
                    const ext_id_option_specified = typeof ext_id === 'string';
                    const matched_ext_id_from_options = ext_info_2.id === ext_id;

                    if (
                        ext_info_2.id !== we.runtime.id &&
                        ext_info_2.enabled &&
                        ext_info_2.installType === 'development' &&
                        ((ext_info_2.type === 'theme' && settings_2.prefs.allow_theme_reload) ||
                            ext_info_2.type !== 'theme') &&
                        (!ext_id_option_specified || matched_ext_id_from_options)
                    ) {
                        extension_is_eligible_for_reload = true;
                    }
                }, 'aer_1112');

            let extension_is_eligible_for_reload = false;

            if (n(ext_info) && n(settings)) {
                extension_is_eligible_for_reload_inner({
                    ext_info_2: ext_info,
                    settings_2: settings,
                });
            } else {
                const settings_2 = await ext.send_msg_resp({ msg: 'get_settings' });
                const exts: Management.ExtensionInfo[] = await ext.send_msg_resp({
                    msg: 'get_all_extensions',
                });

                await Promise.all(
                    exts.map(async (ext_info_2: Management.ExtensionInfo) =>
                        err((): void => {
                            extension_is_eligible_for_reload_inner({
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
