/* eslint-disable max-classes-per-file */
import React from 'react';
import { observer } from 'mobx-react';

@observer
export class Body extends React.Component {
    public render(): JSX.Element {
        return (
            <div className='main'>
                <div className='main_2'>
                    <div className='main_3' />
                </div>
            </div>
        );
    }
}
