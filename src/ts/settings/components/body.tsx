/* eslint-disable max-classes-per-file */
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import {
    Settings,
} from '@loftyshaky/shared/settings';
import { d_sections } from 'settings/internal';

export const Body = observer(() => {
    useEffect(() => {
        d_sections.Val.i.set_on_page_load();
    },
    []);

    return (
        <Settings
            sections={d_sections.Main.i.sections}
            initial_section='settings'
            change_section_callback={() => undefined}
        />
    );
});
