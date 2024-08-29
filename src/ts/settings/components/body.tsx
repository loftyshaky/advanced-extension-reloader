import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { c_settings } from '@loftyshaky/shared/settings';
import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { d_sections, p_settings } from 'settings/internal';

export const Body: React.FunctionComponent<p_settings.Body> = observer((props) => {
    const { on_render } = props;

    useEffect(() => {
        on_render();
    }, [on_render]);

    useEffect(
        () =>
            err(() => {
                const run = async () =>
                    err(() => {
                        d_inputs.NestedInput.set_all_parents_disbled_vals({
                            sections: d_sections.Sections.sections as i_inputs.Sections,
                        });
                    }, 'aer_1044');

                run();
            }, 'aer_1045'),
        [],
    );

    return (
        <div className='main'>
            <c_settings.Body
                sections={d_sections.Sections.sections as i_inputs.Sections}
                initial_section={d_sections.Sections.current_section}
                change_section_callback={(): void => {
                    d_inputs.NestedInput.set_all_parents_disbled_vals({
                        sections: d_sections.Sections.sections as i_inputs.Sections,
                    });

                    d_sections.Sections.change_current_section_val();
                }}
                enable_developer_mode_save_callback={
                    d_sections.Val.enable_developer_mode_save_callback
                }
            />
        </div>
    );
});
