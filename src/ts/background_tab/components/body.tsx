import React from 'react';
import { observer } from 'mobx-react';

export const Body: React.FunctionComponent = observer(() => (
    <div className='main'>
        <div className='background_tab_manifest_3_msg'>
            {ext.msg('background_tab_manifest_3_msg_text')}
        </div>
    </div>
));
