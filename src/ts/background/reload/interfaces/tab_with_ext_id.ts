import { Tabs } from 'webextension-polyfill-ts';

export interface TabWithExtId extends Tabs.Tab {
    ext_id: string;
}
