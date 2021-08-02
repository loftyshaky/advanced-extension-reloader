const appRoot = require('app-root-path').path;

const { Manifest: ManifestShared } = require('@loftyshaky/shared/js/ext/manifest');

const manifest_shared = new ManifestShared({ app_root: appRoot });

class Manifest {
    generate = ({ mode, browser }) => {
        const manifest = {
            manifest_version: 3,
            name: 'Advanced Extension Reloader',
            description: '__MSG_description__',
            background: {
                service_worker: 'background.js',
            },
            options_ui: {
                page: 'settings.html',
                open_in_tab: true,
            },
            permissions: ['storage', 'tabs', 'management', 'contextMenus'],
            commands: {
                reload_main: {
                    description: '__MSG_reload_main_hotkey__',
                },
                reload_1: {
                    description: '__MSG_reload_1_hotkey__',
                },
                reload_2: {
                    description: '__MSG_reload_2_hotkey__',
                },
                reload_3: {
                    description: '__MSG_reload_3_hotkey__',
                },
                reload_4: {
                    description: '__MSG_reload_4_hotkey__',
                },
                reload_5: {
                    description: '__MSG_reload_5_hotkey__',
                },
                reload_6: {
                    description: '__MSG_reload_6_hotkey__',
                },
                reload_7: {
                    description: '__MSG_reload_7_hotkey__',
                },
                reload_8: {
                    description: '__MSG_reload_8_hotkey__',
                },
                reload_9: {
                    description: '__MSG_reload_9_hotkey__',
                },
                reload_10: {
                    description: '__MSG_reload_10_hotkey__',
                },
                reload_11: {
                    description: '__MSG_reload_11_hotkey__',
                },
                reload_12: {
                    description: '__MSG_reload_12_hotkey__',
                },
                reload_13: {
                    description: '__MSG_reload_13_hotkey__',
                },
                reload_14: {
                    description: '__MSG_reload_14_hotkey__',
                },
                reload_15: {
                    description: '__MSG_reload_15_hotkey__',
                },
                reload_16: {
                    description: '__MSG_reload_16_hotkey__',
                },
                reload_17: {
                    description: '__MSG_reload_17_hotkey__',
                },
                reload_18: {
                    description: '__MSG_reload_18_hotkey__',
                },
                reload_19: {
                    description: '__MSG_reload_19_hotkey__',
                },
                reload_20: {
                    description: '__MSG_reload_20_hotkey__',
                },
            },
        };

        if (mode === 'development') {
            manifest.key =
                'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5DLBHROvhHfyyZJYqgVvijGHfLuZdXRHIL0Qm9Tk8PTTpdY6mF/c3Pih+TrCpPZXOI0WePhspKSI6tY7nCPFKe1+2V3iFgKFgxf5wbWHq314oKmXfplLBPIDHcw5gnpsWWDjzziNIdhv4xVXney1oSw7l7N8dCNj5T3b70cbYaVWuDaq4exeid7NrTA1ur0DYm767BXkikvnjla/NsaXSp6Ja9OXPOrFR679nO81m9ul+0nbd9Pw+lEWhF5DLtE4caTr+n2ae9w4WCPlepV1hkw5K5azwxfbdR3GLlgF8w3UdCIWDdsSS5flwF2EzbeVXrWFhig9LIkApW+xBvN1PQIDAQAB';
        }

        manifest_shared.generate({
            manifest,
            mode,
            browser,
        });
    };
}

module.exports = { Manifest };
