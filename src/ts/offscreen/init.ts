export const init = (): Promise<void> =>
    err_async(async () => {
        ext.send_msg({ msg: 'react_to_change' });
    }, 'aer_1000');
