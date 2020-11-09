/* eslint-disable max-classes-per-file */
import React from 'react';
import { observer } from 'mobx-react';

import {
    Settings,
} from '@loftyshaky/shared/settings';
import { d_sections } from 'settings/internal';

@observer
export class Body extends React.Component {
    public render(): JSX.Element {
        return (
            <Settings
                sections={d_sections.Main.i.sections}
                initial_section='settings'
                change_section_callback={() => undefined}
            />
        );
    }
}
