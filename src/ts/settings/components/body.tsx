import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { c_settings } from '@loftyshaky/shared/settings';
import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { d_sections, p_sections } from 'settings/internal';
import { d_settings } from 'shared/internal';

export const Body: React.FunctionComponent<p_sections.Body> = observer((props) => {
    const { on_render } = props;

    useEffect(() => {
        on_render();
    }, [on_render]);

    useEffect(
        () =>
            err(() => {
                const run = async () =>
                    err(() => {
                        d_settings.Transform.i().set_transformed_from_storage();

                        d_inputs.NestedInput.i().set_all_parents_disbled_vals({
                            sections: d_sections.Main.i().sections as i_inputs.Sections,
                        });
                    }, 'aer_1044');

                run();
            }, 'aer_1045'),
        [],
    );

    return (
        <c_settings.Body
            sections={d_sections.Main.i().sections as i_inputs.Sections}
            initial_section={d_sections.Main.i().current_section}
            change_section_callback={(): void => {
                d_inputs.NestedInput.i().set_all_parents_disbled_vals({
                    sections: d_sections.Main.i().sections as i_inputs.Sections,
                });

                d_sections.Main.i().change_section_val();
            }}
        />
    );
});
