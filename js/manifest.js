const appRoot = require('app-root-path').path;

const { Manifest: ManifestShared } = require('@loftyshaky/shared/js/ext/manifest');

const manifest_shared = new ManifestShared({ app_root: appRoot });

class Manifest {
    generate = ({ mode, test, browser }) => {
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

        if (test) {
            manifest.key =
                'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCs/m2UkbY8ervV+3tQxiXPfh5axEFhcXjH7iTNs5+qnjfs9moW/i+HScn0S9fL3fP4fXHYiOuhcjsq8tfimWrhRZsvnd8aH6Ynz+sARu4lJsZZNhzxOmfD8XokKYHW0+7grqSHyH9oxX6jgjMiM6rI0aZEeHFCcYm4cvAoMecN2uXOnIdRayMDZs5t/upe4DojcpnRLewbPR/gWaFR/mnKcR6P91YAM4rjy/gYhd33f2vV0FPwgpoPi0ShqyvI/OPHRnLBje9XBoGQCCotegAZv+B9zlJscEqdoJufgBoBv68XIvL01Oy0m7ubwo/B5S2rTtFhQkNuaOnfGA3wVZOVAgMBAAECggEAALVGEEhqg3NgBi8HDf1GnkONT9m4Jw/VnO6XmZ8/WEsTvl0sHlkjK2V5c8+pcl8q3r2jhVHoiMmgyoH1BDy3M4nNVTuapKcRrIO/Q3ARRFFCB7H3UctZnCrPJ7T7TQ95eqMtO0/q2j2Y7Ql3Fe1qdOkH90qe3QjbGfxF6kYmc0AFWqZKSQIK1q47HvP8+wbNc66kwOcICh7bsZCZd0Uv2GrddGNYi38MlKm2kQjAHbdWxjJxCVcBpBZgXaOO+XqXP92V0h6eWw82FeVtUobwVSqIT7fd6TPW89PISkMU9Chd5uy7EJN0CUaf8HzY7uPU3M7iGuftt3WKvEgmFMlNMQKBgQDrCIw4+pywkBneGfSfvcfd/7APLeTjW6hrhTTJhLvLyMed8ju7dXuwYMDZ4aDv1S8ju8gH7rzHJGQSeQsE3CyhBFFFoY3ikJmBb1BtjNKP38ZNRy7VJ6V8VxAyMpIE/gV6U5IZwVjKeOxd6R+LDkwIGHdO3jn5IFY3fsTDYgrsHQKBgQC8bRW+9a7bMuVJ/JqVpQDYWzmiODH3hByMcFLDKdZSWUvlUzdamVfEz83cpZnmOM7+qbH0PQ3De5KTHBKWNVSM0FIve6IS7+0JSN016EZPW33VNVgGZBjLk2guHN1KtFe9OQnWKVtwMMNeY9oOledneyzV7m/8lZR9l9mri2/72QKBgQCCwHeZvznqM9BgMdpX/7Ev/G2KlEKQhU41up46OaBr5x+966N1Tw9nePvwekgZBGU8INxQJW1Z8BHIARSzOHWPgiJgdVbEoyLy0eVRfJUrOxdLqH0SUgMLIDg/ZMi9BEAx5EoUD+8AfLMqL2W/600697lv48smn+m258w40dM3tQKBgQCl15U2N+MoxskMr6oXX904kEJPxwojgkHmUc5mO+KJJFMqim3D7gdUEFpug8rK2OFHP3CDOWFt1suRczngvxulvI05gaWK6WVFsL4Sflez7SD5kTPinCM+uoUNYRZcdBJtV1CTEF+MhT7PSy9XexTq/Xze5jfmpnjFeet5kwaDMQKBgQCPiJHLOP5sXwCDfUYnn8eXxJzC5cKH4ENfET287dqBAh9tESq4SzerWvMQuzZ3mebK2TyJItQCbhZ66YchcAf7MgL5UNzvO2sTseWzCPEHX5dPG5PngM3KSSzTJgp0/qEtMK+SXz6ZnDAEEOeXrxgpceurB1nO7q1QFLlMn8oJfQ==';
        }

        manifest_shared.generate({
            manifest,
            mode,
            browser,
        });
    };
}

module.exports = { Manifest };
