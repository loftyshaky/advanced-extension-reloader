# Advanced Extension Reloader

<a href="https://github.com/loftyshaky/advanced-extension-reloader/tags"><img src="https://img.shields.io/github/v/tag/loftyshaky/advanced-extension-reloader?label=Version&color=blue" alt="Version"></a> <a href="LICENSE.md"><img src="https://img.shields.io/badge/License-MIT-orange.svg" alt="License: MIT"></a> <img src="https://img.shields.io/github/downloads/loftyshaky/advanced-extension-reloader/total?label=Downloads%20&color=green" alt="GitHub all releases"> <img src="https://img.shields.io/github/downloads/loftyshaky/advanced-extension-reloader/latest/total?sort=date&label=Downloads@Latest&color=green" alt="GitHub Release">

A browser extension that enables you to reload an unpacked extension with one click, a hotkey, or automatically (extension for developers).

## Links

[README.md на русском](https://github.com/loftyshaky/advanced-extension-reloader/blob/master/README-RU.md)<br>
[Chrome Web Store](https://chromewebstore.google.com/detail/hagknokdofkmojolcpbddjfdjhnjdkae)<br>
[Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/bcpgohifjmmcoiemghdamamlkbcbgifg)<br>
[Add-ons for Firefox](https://google.com)

## Firefox support

**Advanced Extension Reloader** is now available for [Firefox](https://google.com)! Before using it, be sure to read the [Firefox considerations](#firefox-considerations) section.

## API changes in Advanced Extension Reloader Watch 2 3.0.0

Version 3.0.0 of **Advanced Extension Reloader Watch 2** introduces a simplified import system. The module now automatically handles the module format for you, eliminating the need to choose between ES and UMD builds.

**Reloader import changes:**

Previously, you had to import `Reloader` from either the `es` or `umd` directory:

```typescript
import Reloader from 'advanced-extension-reloader-watch-2/es/reloader';
```

or:

```typescript
import Reloader from 'advanced-extension-reloader-watch-2/umd/reloader';
```

From now on, simply import `Reloader` like this:

```typescript
import { Reloader } from 'advanced-extension-reloader-watch-2/reloader';
```

The package now detects your environment and serves the appropriate format automatically.

**Listener import changes:**

The `Listener` import has also been simplified. Previously, you needed to import `Listener` and manually call `listen()`:

```typescript
import Listener from 'advanced-extension-reloader-watch-2/umd/listener';

new Listener().listen();
```

Now, the `listener` automatically activates when imported. Simply add this line to your background script:

```typescript
import 'advanced-extension-reloader-watch-2/listener';
```

The old `Listener().listen();` step is no longer required.

**For non-bundler setups:**

If you're using **Advanced Extension Reloader Watch-1** without a bundler, replace your existing `listener.js` file with one of the following:

[ES](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/listener.es.mjs)<br>
[UMD](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/listener.umd.js)

## About

**Advanced Extension Reloader** is a powerful browser extension that simplifies extension development by allowing you to reload your unpacked extensions with a single click, hotkey or automatically when files change. It features audio notifications to confirm reloads. Ideal for extension developers, it enhances efficiency and streamlines your workflow.

**Features:**

🎯 Reload a specific extension by targeting an extension with a specific ID.

⌨️ Reload extensions using a hotkey.

🔄 Set up automatic reloading of your extensions when their files change using the supplementary npm packages **Advanced Extension Reloader Watch 1** (for development without a bundler) or **Advanced Extension Reloader Watch 2** (for development with a bundler).

🔔 Receive audio notifications when your extensions are successfully reloaded.

📄 Reload the current tab or all open tabs after your extensions are reloaded (useful for content scripts).

♻️ Advanced Extension Reloader will also reopen the popup and any tabs that were closed during the reload process, including your extension's options page.

Below is a detailed guide on how to use **Advanced Extension Reloader** and its supplementary packages.

## Content

- [Manual reload](#manual-reload)
- [Automatic reload](#automatic-reload)
- [Advanced Extension Reloader Watch 1: Auto reload WITHOUT bundler](#advanced-extension-reloader-watch-1-auto-reload-without-bundler)
- [Advanced Extension Reloader Watch 2: Auto reload WITH bundler](#advanced-extension-reloader-watch-2-auto-reload-with-bundler)
- [Popup reload](#popup-reload)
- [Apply changes in manifest.json on reload](#apply-changes-in-manifestjson-on-reload)
- [Pause automatic reload](#pause-automatic-reload)
- [Sample extensions](#sample-extensions)
- [Audio notifications](#audio-notifications)
- [Firefox considerations](#firefox-considerations)
- [API reference](#api-reference)
- [Build steps](#build-steps)

## Manual reload

To manually reload your extension(s), either click the extension's icon in the toolbar or use the _Activate the extension_ hotkey, which you can specify at _chrome://extensions/shortcuts_. You can customize the reload behavior by adjusting the _Extension icon click action_ field on the settings page.

**Example settings:**

```json
{
    "all_tabs": false,
    "hard": true,
    "extension_id": "pacanmlfjnfoolpglkcpbpoiapkgpaph",
    "play_notifications": true
}
```

Right-clicking on the extension's icon provides additional reload options, which you can configure in the _Extension icon context menu actions_ field on the settings page.

This field accepts an array of objects, each following the same schema as in the _Extension icon click action_. Additionally, you can trigger these reload actions by using the _Reload extension X_ hotkeys defined at _chrome://extensions/shortcuts_, where _X_ corresponds to the position of the action in the array + 1.

## Automatic reload

To enable automatic extension reloading, you'll need two supplementary npm packages: **Advanced Extension Reloader Watch 1** and **Advanced Extension Reloader Watch 2**. You'll need to have Node.js and the npm package manager installed to use these packages.

## Advanced Extension Reloader Watch 1: Auto reload WITHOUT bundler

For extensions developed without a bundler, use **Advanced Extension Reloader Watch 1**. This package watches your files for changes and sends a message to the **Advanced Extension Reloader** to trigger a reload.<br>

**To use it:**

1. Install the package globally:

    ```shell
    npm install advanced-extension-reloader-watch-1 --global
    ```

2. Create a _config.json_ file anywhere on your machine. Replace `extension_id` with your extension's ID:

    ```json
    {
        "port": 6222,
        "watch_dir": "D:/Cloud/Projects/Advanced Extension Reloader Examples/advanced-extension-reloader-examples/no_bundler/extensions/manifest_3_es",
        "extension_id": "pacanmlfjnfoolpglkcpbpoiapkgpaph",
        "play_notifications": true
    }
    ```

    🚩 Important: The port specified here must be duplicated in the **Advanced Extension Reloader** settings page.

3. Open a command prompt/terminal and run:
    ```shell
    watch-ext --config path_to_your_config.json
    ```

## Advanced Extension Reloader Watch 2: Auto reload WITH bundler

For extensions developed with a bundler, use **Advanced Extension Reloader Watch 2**.<br>

**Example usage in a Vite/Webpack project:**

1. Install **Advanced Extension Reloader Watch 2**:

    ```shell
    npm install advanced-extension-reloader-watch-2
    ```

2. Import `Reloader` in your bundler config:

    ```typescript
    import { Reloader } from 'advanced-extension-reloader-watch-2/reloader';
    ```

3. Start watching files in your project's `src` directory:

    ```typescript
    const reloader = new Reloader({ port: 6220 });

    reloader.watch();
    ```

    To watch a different directory, set the `watch_dir` property.

    🚩 Important: The port specified here must be duplicated in the **Advanced Extension Reloader** settings page.

4. Add the following to the plugins array in your bundler config. Replace extension_id with your actual extension ID:

    **Vite example**:

    ```typescript
    const extension_id = 'ppeafhheghiffmmflaenlfihmeoloiad'; // Declare at the top level
    let build_error: boolean = false; // Declare after const config = defineConfig(() => {

    // Add this to the "plugins" array
    {
        name: 'build_event',
        buildEnd(err: unknown) {
            if (err) {
                build_error = true;
            }
        },
        closeBundle() {
            if (build_error) {
                reloader.play_error_notification({ extension_id });
            } else {
                reloader.reload({
                    extension_id,
                    play_notifications: true,
                });
            }

            build_error = false;
        },
    },
    ```

    **Webpack example**:

    ```javascript
    const extension_id = 'dphafhlelejgffkmbmnmomfehnekdnlj'; // Declare at the top level

    // Add this to the "plugins" array
    {
        apply: (compiler) => {
            compiler.hooks.done.tap('done', (stats) => {
                const an_error_occured = stats.compilation.errors.length !== 0;

                if (an_error_occured) {
                    reloader.play_error_notification({ extension_id });
                } else {
                    reloader.reload({
                        extension_id,
                        play_notifications: true,
                    });
                }
            });
        },
    },
    ```

    The `reloader.reload()` method reloads your extension, and `reloader.play_error_notification()` plays an audio notification on bundling failure.

You can view a full Vite config example [here](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/vite/vite.config.ts), and a Webpack config example [here](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/webpack/webpack.config.js).

## Popup reload

If you perform a hard reload while the popup is open, **Advanced Extension Reloader** will automatically reopen it. To ensure the popup always opens, even if it was closed before the reload, set the `always_open_popup` property to `true`. Additionally, you can use the `always_open_popup_paths` property to specify which file paths should cause the popup to open each time a change occurs. You'll also need to provide `extension_id`, otherwise popup reload won't work.

## Apply changes in manifest.json on reload

To ensure that changes to the _manifest.json_ file are applied upon reloading your extension, you'll need to use the `listen` module from the **Advanced Extension Reloader Watch 2** supplementary package.<br>

**Here's how to set it up:**

- For non-bundler setups, download the appropriate listener.js file based on your background script type:

    If your background script is an ES module, download the file [here](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/listener.es.mjs).<br>
    If your background script is not an ES module, download the file [here](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/listener.umd.js).

- For bundler setups, import the listener in your background script like this:

    ```typescript
    import 'advanced-extension-reloader-watch-2/listener';
    ```

## Pause automatic reload

To pause automatic reloading, right-click the extension's icon and select the _Pause Automatic Reload_ option. Alternatively, you can use the _Pause/Resume Automatic Reload_ hotkey, which can be configured at _chrome://extensions/shortcuts_.

## Sample extensions

Sample extensions can be found [here](https://github.com/loftyshaky/advanced-extension-reloader-examples).

## Audio notifications

**Advanced Extension Reloader** offers five distinct audio notifications. You can listen to each of them by clicking the links below:

- [Reload success - extension installed and enabled](https://freesound.org/people/PaulMorek/sounds/330046): Plays after the extension has been reloaded and is confirmed to be installed and enabled in the browser.
- [Reload success - extension NOT installed or disabled](https://freesound.org/people/PaulMorek/sounds/330056): Plays after attempting to reload the extension and finding that it is not installed or disabled in the browser.
- [Reload error - extension installed and enabled](https://freesound.org/people/PaulMorek/sounds/330068): Plays when `reloader.play_error_notification()` is called, and the extension is found to be installed and enabled in the browser.
- [Reload error - extension NOT installed or disabled](https://freesound.org/people/PaulMorek/sounds/330067): Plays when `reloader.play_error_notification()` is called, and the extension is found to not be installed or disabled in the browser.
- [Manifest error](https://freesound.org/people/StavSounds/sounds/701704): Plays when the _manifest.json_ file is found to be invalid.

## Firefox considerations

Reloading extensions in Firefox requires special handling. To enable both manual and automatic reload, you must include the `listener` module as described [above](#apply-changes-in-manifestjson-on-reload). Without it, reload will not work.

For automatic reload, you'll also need to provide the **Advanced Extension Reloader's** Internal UUID. You can find this ID at `about:debugging#/runtime/this-firefox`. Pass it to the config or `Reloader` constructor using the `firefox_advanced_extension_reloader_internal_uuids` property:

**Advanced Extension Reloader Watch 1**

```json
{
    "port": 6225,
    "watch_dir": "D:/Cloud/Projects/Advanced Extension Reloader Examples/advanced-extension-reloader-examples/no_bundler/extensions/firefox_manifest_3_es",
    "firefox_advanced_extension_reloader_internal_uuids": ["b3bca27c-ef23-4759-bc14-fc88d04b9541"],
    "extension_id": "firefox-manifest-3-extension-example-es@loftyshaky",
    "play_notifications": true
}
```

**Advanced Extension Reloader Watch 2**

```typescript
const reloader = new Reloader({
    port: 6224,
    firefox_advanced_extension_reloader_internal_uuids: ['b3bca27c-ef23-4759-bc14-fc88d04b9541'],
});

reloader.watch();
```

Note that `extension_id` is a different identifier and should match the ID specified in your `manifest.json` (`browser_specific_settings > gecko > id`).

⚠️ **Important:** This UUID is unique to each Firefox profile. You'll need to update it if you switch profiles or work on a different machine. The `firefox_advanced_extension_reloader_internal_uuids` property accepts an array, so you can pass multiple UUIDs if needed.

Full configuration examples can be found [here](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/no_bundler/config/firefox_manifest_3_es.json) for **Advanced Extension Reloader Watch 1** and [here](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/vite_firefox/vite.config.ts) for **Advanced Extension Reloader Watch 2**. To make these examples work, replace `your_advanced_extension_reloader_internal_uuid` with your actual Internal UUID.

## API reference

| Property                                             | Type                  | Default value | Applies to                                                                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :--------------------------------------------------- | :-------------------- | :------------ | :---------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hard`                                               | `boolean`             | `true`        | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Determines whether to reload the entire extension (`true`) or just the current tab (`false`). If set to `false`, changes to the background script will not be applied.<br><br>Even if set to `true`, changes to the _manifest.json_ file will not be applied unless you use the `listen` module from the **Advanced Extension Reloader Watch 2** supplementary npm package in your extension's background script.<br><br>This option can be used in conjunction with `all_tabs`.                                                                     |
| `all_tabs`                                           | `boolean`             | `false`       | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Specifies whether to reload all open tabs instead of just the current one.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `always_open_popup`                                  | `boolean`             | `false`       | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Determines whether the popup should open after a `hard` reload of your extension. This property controls the opening of the popup only if it was closed before the reload. Even when set to `false`, **Advanced Extension Reloader** will automatically open the popup if it was open during the reload. This option will only work if you also provide `extension_id`.                                                                                                                                                                              |
| `extension_id`                                       | `string`              | `undefined`   | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Defines the ID of the extension to reload. If left `undefined`, all extensions will be reloaded.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `play_notifications`                                 | `boolean`             | `false`       | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Indicates whether to play audio notifications for reload or bundling success/failure.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `min_interval_between_extension_reloads`             | `number`              | `500`         | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Defines the minimum interval, in milliseconds, between extension reloads, ensuring that the **Advanced Extension Reloader** triggers the reload at most once during this period.                                                                                                                                                                                                                                                                                                                                                                     |
| `delay_after_extension_reload`                       | `number`              | `1000`        | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Specifies the time, in milliseconds, to wait after an extension is reloaded before reopening any closed tabs.<br><br>If your extension experiences issues, such as errors or blank pages after a reload, you may want to increase this value.                                                                                                                                                                                                                                                                                                        |
| `delay_after_tab_reload`                             | `number`              | `2000`        | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Specifies time, in milliseconds, to wait after an extension's tabs are reopened before the extension can be reloaded again.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `listen_message_response_timeout`                    | `number`              | `400`         | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Specifies the duration to wait for a response from your extension when using the `listen` module. During this process, the **Advanced Extension Reloader** sends a message to your extension's background script to trigger a reload using `runtime.reload()`. If no response is received (e.g., if the service worker is unresponsive), the **Advanced Extension Reloader** will force a reload using `management.setEnabled`.                                                                                                                      |
| `port`                                               | `number`              | `7220`        | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | The **Advanced Extension Reloader Watch 1/2** sets up a server that listens on a specified port and accepts connections from the **Advanced Extension Reloader**.<br><br>The **Advanced Extension Reloader** connects to this server using this port and listens for reload events. When a reload event is received, it automatically reloads the extensions you're developing.<br><br>🚩 Important: The port must be configured in both the **Advanced Extension Reloader Watch 1/2** config and the **Advanced Extension Reloader** settings page. |
| `watch_dir`                                          | `string`              | `src`         | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | A path to the directory to watch for file changes. Should be your extension's directory path.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `firefox_advanced_extension_reloader_internal_uuids` | `string[]`            | `[]`          | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Internal UUIDs of the **Advanced Extension Reloader** Firefox installation. These are required to enable automatic reload in Firefox.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `manifest_path`                                      | `boolean` \| `string` | `false`       | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Path to the extension's _manifest.json_ file: This can be specified as a boolean value or a path. If set to `true`, **Advanced Extension Reloader Watch 1/2** will automatically search for the _manifest.json_ file in the `watch_dir` directory.<br><br>This option is necessary for **Advanced Extension Reloader Watch 1/2** to validate the _manifest.json_ before reloading the extension. If the _manifest.json_ file is found to be invalid, the reload process will be canceled to prevent the extension from crashing.                     |
| `hard_paths`                                         | `string[]`            | `[]`          | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | An array of paths or partial paths (such as file names). If a change occurs in any file or directory matching these paths, the extension will be reloaded with `hard`: `true`, even if `hard`: `false` is specified in the configuration.                                                                                                                                                                                                                                                                                                            |
| `soft_paths`                                         | `string[]`            | `[]`          | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | An array of paths or partial paths (such as file names). If a change occurs in any file or directory matching these paths, the extension will be reloaded with `hard`: `false`, even if `hard`: `true` is specified in the configuration.                                                                                                                                                                                                                                                                                                            |
| `all_tabs_paths`                                     | `string[]`            | `[]`          | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | An array of paths or partial paths (such as file names). If a change occurs in any file or directory matching these paths, the extension will be reloaded with `all_tabs`: `true`, even if `all_tabs`: `false` is specified in the configuration.                                                                                                                                                                                                                                                                                                    |
| `one_tab_paths`                                      | `string[]`            | `[]`          | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | An array of paths or partial paths (such as file names). If a change occurs in any file or directory matching these paths, the extension will be reloaded with `all_tabs`: `false`, even if `all_tabs`: `true` is specified in the configuration.                                                                                                                                                                                                                                                                                                    |
| `always_open_popup_paths`                            | `string[]`            | `[]`          | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | An array of paths or partial paths (such as file names). If a change occurs in any file or directory matching these paths, your extension's popup will be opened, even if it was closed before the reload.                                                                                                                                                                                                                                                                                                                                           |

## Build steps

1. `git clone https://github.com/loftyshaky/advanced-extension-reloader`
2. `cd` into the cloned repository
3. `npm install`
4. `npm run prod_test` (Chrome) / `npm run prod_test_edge` (Edge) / `npm run prod_test_opera` (Opera) / `npm run prod_test_brave` (Brave) / `npm run prod_test_yandex` (Yandex Browser) / `npm run prod_test_firefox` (Firefox)
