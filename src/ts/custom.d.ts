interface Window {
    page: 'background' | 'settings';
    show_dependencicies_from_other_page_loaded_into_this_page_alert: import('shared/internal').t.CallbackVariadicVoid;
}

declare module '*.svg' {
    const content: any;
    export default content;
}

declare module 'socket.io-client';
declare module 'chrome';
