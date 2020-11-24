import { Manifest as ManifestShared } from './loftyshaky/ext/manifest';

const manifest_shared = new ManifestShared();

export class Manifest {
    generate = () => {
        const manifest = {
            name: 'Extension Reloader',
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
                'management',
                'contextMenus',
            ],
        };

        if (process.env.build === 'dev') {
            manifest.permissions.push('tabs');
        }

        manifest_shared.generate({ manifest });
    }
}
