<h1 id="advanced_extension_reloader">Advanced Extension Reloader</h2>

A browser extension that enables you to reload an unpacked extension with one click, a hotkey or automatically (extension for developers).

<h2 id="links">Links</h2>

[README.md на русском](https://github.com/loftyshaky/advanced-extension-reloader/blob/master/README-RU.md)<br>
[Chrome Web Store](https://chromewebstore.google.com/detail/hagknokdofkmojolcpbddjfdjhnjdkae)<br>
[Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/bcpgohifjmmcoiemghdamamlkbcbgifg)

<h2 id="api_changes">API changes in Advanced Extension Reloader 2.0.0</h2>

The `ext_id`, `play_sound` and `after_reload_delay` properties have been renamed to `extension_id`, `play_notifications` and `delay_after_extension_reload`, respectively. These changes apply to **Advanced Extension Reloader**, **Advanced Extension Reloader Watch 1** and **Advanced Extension Reloader Watch 2**.

<h2 id="about">About</h2>

**Advanced Extension Reloader** is a powerful browser extension that simplifies extension development by allowing you to reload your unpacked extensions with a single click, hotkey or automatically when files change. It features audio notifications to confirm reloads. Ideal for extension developers, it enhances efficiency and streamlines your workflow.

**Features:**

🎯 Reload a specific extension by targeting an extension with a specific ID.

⌨️ Reload extensions using a hotkey.

🔄 Set up automatic reloading of your extensions when their files change using the supplementary npm packages **Advanced Extension Reloader Watch 1** (for development without a bundler) or **Advanced Extension Reloader Watch 2** (for development with a bundler).

🔔 Receive audio notifications when your extensions are successfully reloaded.

📄 Reload the current tab or all open tabs after your extensions are reloaded (useful for content scripts).

♻️ Advanced Extension Reloader will also reopen the popup and any tabs that were closed during the reload process, including your extension's options page.

Below is a detailed guide on how to use **Advanced Extension Reloader** and its supplementary packages.

<h2 id="content">Content</h2>

- [Manual reload](#manual_reload)
- [Automatic reload](#automatic_reload)
- [Advanced Extension Reloader Watch 1: Auto reload WITHOUT bundler](#advanced_extension_reloader_watch_1_no_bundler)
- [Advanced Extension Reloader Watch 2: Auto reload WITH bundler](#advanced_extension_reloader_watch_2_bundler)
- [Popup reload](#popup_reload)
- [Apply changes in manifest.json on reload](#manifest_changes_reload)
- [Pause automatic reload](#pause_automatic_reload)
- [Sample extensions](#sample_extensions)
- [API reference](#api)
- [Audio notifications](#audio_notifications)
- [Build steps](#build_steps)

<h2 id="manual_reload">Manual reload</h2>

To manually reload your extension(s), either click the extension's icon in the toolbar or use the *Activate the extension* hotkey, which you can specify at *chrome://extensions/shortcuts*. You can customize the reload behavior by adjusting the *Extension icon click action* field on the settings page.

**Example settings:**
```javascript
{
    "all_tabs": false,
    "hard": true,
    "extension_id": "dphafhlelejgffkmbmnmomfehnekdnlj",
    "play_notifications": true
}
```

Right-clicking on the extension's icon provides additional reload options, which you can configure in the *Extension icon context menu actions* field on the settings page.

This field accepts an array of objects, each following the same schema as in the *Extension icon click action*. Additionally, you can trigger these reload actions by using the *Reload extension X* hotkeys defined at *chrome://extensions/shortcuts*, where *X* corresponds to the position of the action in the array + 1.

<h2 id="automatic_reload">Automatic reload</h2>

To enable automatic extension reloading, you'll need two supplementary npm packages: **Advanced Extension Reloader Watch 1** and **Advanced Extension Reloader Watch 2**. You'll need to have Node.js and the npm package manager installed to use these packages.

<h2 id="advanced_extension_reloader_watch_1_no_bundler">Advanced Extension Reloader Watch 1: Auto reload WITHOUT bundler</h2>

For extensions developed without a bundler, use **Advanced Extension Reloader Watch 1**. This package watches your files for changes and sends a message to the **Advanced Extension Reloader** to trigger a reload.<br>

**To use it:**

1. Install the package globally:
    ```shell
    npm install advanced-extension-reloader-watch-1 --global
    ```

2. Create a *config.json* file anywhere on your machine. Replace `extension_id` with your extension's ID:
    ```json
    {
        "port": 6220,
        "watch_dir": "D:/Cloud/Projects/Advanced Extension Reloader Examples/advanced-extension-reloader-examples/no_bundler/extensions/manifest_3",
        "extension_id": "pacanmlfjnfoolpglkcpbpoiapkgpaph",
        "play_notifications": true
    }
    ```
    🚩 Important: The port specified here must be duplicated in the **Advanced Extension Reloader** settings page.

3. Open a command prompt/terminal and run:
    ```shell
    watch-ext --config path_to_your_config.json
    ```

<h2 id="advanced_extension_reloader_watch_2_bundler">Advanced Extension Reloader Watch 2: Auto reload WITH bundler</h2>

For extensions developed with a bundler, use **Advanced Extension Reloader Watch 2**.<br>

**Example usage in a Vite/Webpack project:**

1. Install **Advanced Extension Reloader Watch 2**:
    ```shell
    npm install advanced-extension-reloader-watch-2
    ```

2. Import `Reloader` in your bundler config:

    **TypeScript Vite config example**:

    ```typescript
    import Reloader from 'advanced-extension-reloader-watch-2/es/reloader';
    ```

    **JavaScript Webpack config example**:

    ```javascript
    const Reloader = require('advanced-extension-reloader-watch-2/umd/reloader');
    ```

3. Start watching files in your project's `src` directory:
    ```typescript
    const reloader = new Reloader({
        port: 6220,
    });

    reloader.watch();
    ```
    To watch a different directory, set the `watch_dir` property.

    🚩 Important: The port specified here must be duplicated in the **Advanced Extension Reloader** settings page.

4. Add the following to the plugins array in your bundler config. Replace extension_id with your actual extension ID:

    **Vite example**:

    ```typescript
    let bundle_error = false; // Declare at the top level

    // Add this to the "plugins" array
    {
        name: 'build-events',
        apply: 'build',
        buildEnd(an_error_occured) {
            if (an_error_occured) {
                bundle_error = true;

                reloader.play_error_notification({ extension_id });
            }
        },
        closeBundle() {
            if (bundle_error) {
                bundle_error = false;
            } else {
                reloader.reload({
                    extension_id,
                    play_notifications: true,
                });
            }
        },
    },
    ```
    **Webpack example**:

    ```javascript
    {
        apply: (compiler) => {
            compiler.hooks.done.tap('done', (stats) => {
                const an_error_occured = stats.compilation.errors.length !== 0;

                if (an_error_occured) {
                    reloader.play_error_notification({
                        extension_id: 'dphafhlelejgffkmbmnmomfehnekdnlj' 
                    });
                } else {
                    reloader.reload({
                        extension_id: 'dphafhlelejgffkmbmnmomfehnekdnlj',
                        play_notifications: true,
                    });
                }
            });
        },
    },
    ```
    The `reloader.reload()` function reloads your extension, and `reloader.play_error_notification()` plays an audio notification on bundling failure.

You can view a full Vite config example [here](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/vite/vite.config.ts), and a Webpack config example [here](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/webpack/webpack.config.js).

<h2 id="popup_reload">Popup reload</h2>

If you perform a hard reload while the popup is open, **Advanced Extension Reloader** will automatically reopen it. To ensure the popup always opens, even if it was closed before the reload, set the `always_open_popup` property to `true`. Additionally, you can use the `always_open_popup_paths` property to specify which file paths should cause the popup to open each time a change occurs.

<h2 id="manifest_changes_reload">Apply changes in manifest.json on reload</h2>

To ensure that changes to the *manifest.json* file are applied upon reloading your extension, you'll need to use the `listen()` function from the **Advanced Extension Reloader Watch 2** supplementary package.<br>

**Here's how to set it up:**

- For non-bundler setups, download the appropriate listener.js file based on your background script type:

    If your background script is an ES module, download the file [here](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/es/listener.js).<br>
    If your background script is not an ES module, download the file [here](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/umd/listener.js).

- For Webpack setups: Import `Listener` in the background script and call the `listen()` function like so:
    ```javascript
    import Listener from 'advanced-extension-reloader-watch-2/umd/listener';

    new Listener().listen();
    ```

<h2 id="pause_automatic_reload">Pause automatic reload</h2>

To pause automatic reloading, right-click the extension's icon and select the *Pause Automatic Reload* option. Alternatively, you can use the *Pause/Resume Automatic Reload* hotkey, which can be configured at *chrome://extensions/shortcuts*.

<h2 id="sample_extensions">Sample extensions</h2>

Sample extensions can be found [here](https://github.com/loftyshaky/advanced-extension-reloader-examples).

<h2 id="audio_notifications">Audio notifications</h2>

**Advanced Extension Reloader** offers five distinct audio notifications. You can listen to each of them by clicking the links below:

- [Reload success - extension installed](https://freesound.org/people/PaulMorek/sounds/330046): Plays after the extension has been reloaded and is confirmed to be installed in the browser. 
- [Reload success - extension NOT installed](https://freesound.org/people/PaulMorek/sounds/330056) Plays after attempting to reload the extension and finding that it is not installed in the browser.
- [Reload error - extension installed](https://freesound.org/people/PaulMorek/sounds/330068): Plays when `reloader.play_error_notification()` is called, and the extension is found to be installed in the browser.
- [Reload error - extension NOT installed](https://freesound.org/people/PaulMorek/sounds/330067): Plays when `reloader.play_error_notification()` is called, and the extension is found to not be installed in the browser.
- [Manifest error](https://freesound.org/people/PaulMorek/sounds/330065): Plays when the *manifest.json* file is found to be invalid.

<h2 id="api">API reference</h2>

| Property | Type | Default value | Applies to | Description |
| :--- | :--- | :--- | :--- | :--- |
| `hard` | `boolean` | `true` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Determines whether to reload the entire extension (`true`) or just the current tab (`false`). If set to `false`, changes to the background script will not be applied.<br><br>Even if set to `true`, changes to the *manifest.json* file will not be applied unless you use the `listen()` function from the **Advanced Extension Reloader Watch 2** supplementary npm package in your extension's background script.<br><br>This option can be used in conjunction with `all_tabs`. |
| `all_tabs` | `boolean` | `false` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Specifies whether to reload all open tabs instead of just the current one. |
| `always_open_popup` | `boolean` | `false` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Determines whether the popup should open after a `hard` reload of your extension. This property controls the opening of the popup only if it was closed before the reload. Even when set to `false`, **Advanced Extension Reloader** will automatically open the popup if it was open during the reload. |
| `extension_id` | `string` | `undefined` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Defines the ID of the extension to reload. If left `undefined`, all extensions will be reloaded. |
| `play_notifications` | `boolean` | `false` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Indicates whether to play audio notifications for reload success/failure and bundling success. |
| `min_interval_between_extension_reloads` | `number` | `500` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Defines the minimum interval between extension reloads, ensuring that the **Advanced Extension Reloader** triggers the reload at most once during this period. |
| `delay_after_extension_reload` | `number` | `1000` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Specifies the time, in milliseconds, to wait after an extension is reloaded before reopening any closed tabs.<br><br>If your extension experiences issues, such as errors or blank pages after a reload, you may want to increase this value. |
| `delay_after_tab_reload` | `number` | `2000` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Specifies time, in milliseconds, to wait after an extension's tabs are reopened before the extension can be reloaded again. |
| `listen_message_response_timeout` | `number` | `400` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Specifies the duration to wait for a response from your extension when using the `listen()` function. During this process, the **Advanced Extension Reloader** sends a message to your extension's background script to trigger a reload using `runtime.reload()`. If no response is received (e.g., if the service worker is unresponsive), the **Advanced Extension Reloader** will force a reload using `management.setEnabled`. |
| `port` | `number` | `7220` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | The **Advanced Extension Reloader Watch 1/2** sets up a server that listens on a specified port and accepts connections from the **Advanced Extension Reloader**.<br><br>The **Advanced Extension Reloader** connects to this server using this port and listens for reload events. When a reload event is received, it automatically reloads the extensions you're developing.<br><br>🚩 Important: The port must be configured in both the **Advanced Extension Reloader Watch 1/2** config and the **Advanced Extension Reloader** settings page. |
| `watch_dir` | `string` | src | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | A path to the directory to watch for file changes. Should be your extension's directory path. |
| `manifest_path` | `boolean` \| `string` | `false` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Path to the extension's *manifest.json* file: This can be specified as a boolean value or a path. If set to `true`, **Advanced Extension Reloader Watch 1/2** will automatically search for the *manifest.json* file in the `watch_dir` directory.<br><br>This option is necessary for **Advanced Extension Reloader Watch 1/2** to validate the *manifest.json* before reloading the extension. If the *manifest.json* file is found to be invalid, the reload process will be canceled to prevent the extension from crashing. |
| `hard_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | An array of paths or partial paths (such as file names). If a change occurs in any file or directory matching these paths, the extension will be reloaded with `hard`: `true`, even if `hard`: `false` is specified in the configuration. |
| `soft_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | An array of paths or partial paths (such as file names). If a change occurs in any file or directory matching these paths, the extension will be reloaded with `hard`: `false`, even if `hard`: `true` is specified in the configuration. |
| `all_tabs_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | An array of paths or partial paths (such as file names). If a change occurs in any file or directory matching these paths, the extension will be reloaded with `all_tabs`: `true`, even if `all_tabs`: `false` is specified in the configuration. |
| `one_tab_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | An array of paths or partial paths (such as file names). If a change occurs in any file or directory matching these paths, the extension will be reloaded with `all_tabs`: `false`, even if `all_tabs`: `true` is specified in the configuration. |
| `always_open_popup_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | An array of paths or partial paths (such as file names). If a change occurs in any file or directory matching these paths, your extension's popup will be opened, even if it was closed before the reload. |

<h2 id="build_steps">Build steps</h2>

1. git clone https://github.com/loftyshaky/advanced-extension-reloader
2. cd into the cloned repository
3. npm install
4. npm run prod (Chrome) / npm run prode (Edge)