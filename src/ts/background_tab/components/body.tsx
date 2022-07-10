import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { p_background_tab } from 'background_tab/internal';

export const Body: React.FunctionComponent<p_background_tab.Body> = observer((props) => {
    const { on_render } = props;

    useEffect(() => {
        on_render();
    }, [on_render]);

    return (
        <div className='main'>
            <div className='background_tab_manifest_3_msg'>
                {ext.msg('background_tab_manifest_3_msg_text')}
            </div>
        </div>
    );
});
