import _ from 'lodash';

import {
    BaseTr,
    Transition,
} from '@loftyshaky/shared';

export class Tr extends BaseTr {
    constructor(props: any) {
        super(props);
        this.transitions = _.merge(
            {},
            this.transitions,
            {
                color_change: new Transition({
                    unactive_cls: 'color_a',
                    active_cls: 'color_b',
                }),
                margin_change: new Transition({
                    unactive_cls: 'margin_a',
                    active_cls: 'margin_b',
                }),
            },
        );
    }
}
