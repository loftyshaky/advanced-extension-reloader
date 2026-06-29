export const init = (): Promise<void> =>
    err_async(async () => {
        if (env.browser === 'firefox') {
            const { s_side_effects } = await import('background/internal');

            void s_side_effects.SideEffects.react_to_change();
        } else {
            void ext.send_msg({ msg: 'react_to_change' });
        }
    }, 'aer_1000');
