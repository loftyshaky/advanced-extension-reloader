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
            key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5DLBHROvhHfyyZJYqgVvijGHfLuZdXRHIL0Qm9Tk8PTTpdY6mF/c3Pih+TrCpPZXOI0WePhspKSI6tY7nCPFKe1+2V3iFgKFgxf5wbWHq314oKmXfplLBPIDHcw5gnpsWWDjzziNIdhv4xVXney1oSw7l7N8dCNj5T3b70cbYaVWuDaq4exeid7NrTA1ur0DYm767BXkikvnjla/NsaXSp6Ja9OXPOrFR679nO81m9ul+0nbd9Pw+lEWhF5DLtE4caTr+n2ae9w4WCPlepV1hkw5K5azwxfbdR3GLlgF8w3UdCIWDdsSS5flwF2EzbeVXrWFhig9LIkApW+xBvN1PQIDAQAB',
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
