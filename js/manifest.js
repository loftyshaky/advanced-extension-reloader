const appRoot = require('app-root-path').path;

const { Manifest: ManifestShared } = require('@loftyshaky/shared/js/ext/manifest');

const manifest_shared = new ManifestShared({ app_root: appRoot });

class Manifest {
    generate = ({
        mode,
        browser,
    }) => {
        const manifest = {
            name: 'Advanced Extension Reloader',
            description: '__MSG_description__',
            offline_enabled: true,
            background: {
                page: 'background.html',
                persistent: true,
            },
            options_ui: {
                page: 'settings.html',
                chrome_style: false,
                open_in_tab: true,
            },
            permissions: [
                'storage',
                'tabs',
                'management',
                'contextMenus',
            ],
        };

        manifest_shared.generate({
            manifest,
            mode,
            browser,
        });
    }
}

module.exports = { Manifest };
