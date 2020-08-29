/* eslint-disable max-classes-per-file */
import React from 'react';
import { observer } from 'mobx-react';
import { configure, observable, action } from 'mobx';

import { Tr } from 'shared/internal';

configure({ enforceActions: 'observed' });

@observer
export class Body extends React.Component {
    @observable public state_fade: boolean = false;

    @action public trigger = (): void => err(() => {
        if (this.state_fade) {
            this.state_fade = false;
        } else {
            this.state_fade = true;
        }
    },
    111);

    private get_random_color = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        s<any>('.eee').style.backgroundColor = color;
    };

    public callback_unactive = (): void => err(() => {
        s<any>('.eee').textContent = 'UNACTIVE!!!!!!!!!!!!!!!';
        this.get_random_color();
    },
    222);

    public callback_active = (): void => err(() => {
        s<any>('.eee').textContent = 'active??????????????????';
        this.get_random_color();
    },
    222);

    public error = (): void => err(() => {
        // @ts-ignore
        h();
    },
    222);

    public render(): JSX.Element {
        return (
            <>
                <div
                    onClick={this.error}
                    role='none'
                    style={{
                        padding: '30px',
                        backgroundColor: '#e23a3a',
                        color: 'white',
                        marginBottom: '30px',
                    }}
                >
                    Error

                </div>
                <div
                    className='eee'
                    onClick={this.trigger}
                    style={{
                        padding: '30px',
                        backgroundColor: 'green',
                        color: 'white',
                        marginBottom: '30px',
                    }}
                    role='none'
                >
                    Trigger
                </div>
                <Tr
                    name='margin_change'
                    tag='div'
                    cls='margin_change'
                    state={this.state_fade}
                    style={{
                        padding: '30px',
                    }}
                    tr_end_unactive={[this.callback_unactive]}
                    tr_end_active={[this.callback_active]}
                >
                    Test Fade
                </Tr>
            </>
        );
    }
}
