<details>
<summary>English</summary>

## Links

[Chrome Web Store](https://chromewebstore.google.com/detail/hagknokdofkmojolcpbddjfdjhnjdkae)<br>
[Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/bcpgohifjmmcoiemghdamamlkbcbgifg)

## About
**Advanced Extension Reloader** is a browser extension that reloads unpacked extensions you develop for you. By installing this extension you will be able to reload all your unpacked extensions at once with a click on the browser action icon. You will also be able to: 

★ Limit reload only to an extension with a specific id.

★ Reload extension(s) with a hotkey.

★ Set up an automatic reload on your extension's files change with the help of supplementary packages **Advanced Extension Reloader Watch 1** (if you develop an extension without a bundler) or **Advanced Extension Reloader Watch 2** (if you use Webpack).

★ Make **Advanced Extension Reloader** play a sound when your extension(s) is reloaded.

★ Make **Advanced Extension Reloader** reload the current tab or all tabs after your extension(s) is reloaded (useful for content script).

After reloading your extension(s) **Advanced Extension Reloader** will reopen all closed during reloading tabs (for example, the options page of your extension(s)).

Below is a detailed description of how to use the **Advanced Extension Reloader** and its supplementary packages.

## Content
- [Manual reload](#manual_reload_en)
- [Automatic reload](#automatic_reload_en)
- [Advanced Extension Reloader Watch 1 (automatic reload for extensions developed WITHOUT bundler)](#advanced_extension_reloader_watch_1_no_bundler_en)
- [Advanced Extension Reloader Watch 2 (automatic reload for extensions developed WITH bundler)](#advanced_extension_reloader_watch_2_bundler_en)
- [Reload extension on manifest.json changes](#manifest_changes_reload_en)
- [Temporarily suspend automatic reload](#suspend_automatic_reload_en)
- [Sample extensions](#sample_extensions_en)
- [API](#api_en)
- [Build steps](#build_steps_en)

<h2 id="manual_reload_en">Manual reload</h2>

To reload extension(s), click on the extension icon in the toolbar or hit *Reload extension main* hotkey specified at *chrome://extensions/shortcuts*. You can change how your extension is reloaded by editing the *Extension's icon click action* field on the settings page. 

**Example of settings:**
```javascript
{
    "all_tabs": false,
    "hard": true,
    "ext_id": "ffhljpfecjcfjdaneehmhdgplkaafnbb",
    "play_sound": true
}
```

Right-clicking on the extension icon will bring additional reload actions which can be changed by editing the *Extension's icon context menu actions* field on the settings page. 

The field accepts an array of objects with the same schema as seen in *Extension's icon click action*. Keep in mind that there is a limit on how many items can appear there. You can also use reload actions defined there by hitting one of the *Reload extension X* hotkeys specified at *chrome://extensions/shortcuts*, where *X* is a position in the array.

<h2 id="automatic_reload_en">Automatic reload</h2>

To automatically reload your extension you will need two supplementary packages: **Advanced Extension Reloader Watch 1** and **Advanced Extension Reloader Watch 2**. You will need to install Node JS and npm package manager to use them. 

<h2 id="advanced_extension_reloader_watch_1_no_bundler_en">Advanced Extension Reloader Watch 1 (automatic reload for extensions developed WITHOUT bundler)</h2>

If you develop an extension without a bundler you will need **Advanced Extension Reloader Watch 1**. It will watch your files for changes and send a message to **Advanced Extension Reloader**, so it can reload your extension.<br>

**Here is how to use it:**

1. Install the package globally using:
    ```shell
    npm install advanced-extension-reloader-watch-1 --global
    ```

2. Create a *config.json* anywhere on your machine (replace the value of `ext_id` to your extension's id):
    ```json
    {
        "port": 6220,
        "watch_dir": "D:/Cloud/Projects/Advanced Extension Reloader Examples/advanced-extension-reloader-examples/no_bundler/extensions/manifest_3",
        "ext_id": "jepkffhnnekngedhempoflhcmoogpkph",
        "play_sound": true
    }
    ```
    🚩 Important: the port defined here should be duplicated in the **Advanced Extension Reloader's** settings page.

3. Open the command prompt/terminal and execute the following command:
    ```shell
    watch-ext --config path_to_your_config.json
    ```

<h2 id="advanced_extension_reloader_watch_2_bundler_en">Advanced Extension Reloader Watch 2 (automatic reload for extensions developed WITH bundler)</h2>

If you develop an extension with a bundler you will need **Advanced Extension Reloader Watch 2**.<br>

**Here is an example of usage in a Webpack project:**

1. Install **Advanced Extension Reloader Watch 2** using:
    ```shell
    npm install advanced-extension-reloader-watch-2
    ```

2. Import *Reloader* in your Webpack config:
    ```javascript
    const Reloader = require('advanced-extension-reloader-watch-2/umd/reloader');
    ```

3. Start watching files for changes in the *src* folder of your project. if you want to watch another folder, you can set it with `watch_dir` property:
    ```javascript
    const reloader = new Reloader({
        port: 6223,
    });

    reloader.watch();
    ```
    🚩 Important: the port defined here should be duplicated in the **Advanced Extension Reloader's** settings page.

4. Add the following to the `plugins` array (replace the value of `ext_id` to your extension's id):
    ```javascript
    {
        apply: (compiler) => {
            compiler.hooks.done.tap('done', (stats) => {
                const an_error_occured = stats.compilation.errors.length !== 0;

                if (an_error_occured) {
                    reloader.play_error_notification();
                } else {
                    reloader.reload({
                        ext_id: 'dphafhlelejgffkmbmnmomfehnekdnlj',
                        play_sound: true,
                    });
                }
            });
        },
    },
    ```
    The `reloader.reload()` function reloads your extension.<br>
    The `reloader.play_error_notification()` function allows you to play an error notification sound on bundling failure.

See the example of Webpack config [here](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/webpack/webpack.config.js)

<h2 id="manifest_changes_reload_en">Reload extension on manifest.json changes</h2>

If you want your extension to reload on *manifest.json* changes you would need to use `listen()` function from the **Advanced Extension Reloader Watch 2** supplementary package.<br>

**Here's how to use it:**

- For non-bundler set-up, download *listener.js* from [here](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/es/listener.js) if your background script is an ES module, or [here](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/umd/listener.js) otherwise. 

- For Webpack set-up, just `import` the `listener` module as shown below.

- `Import` `listener` in the background script and call `listen()` function like so:
    ```javascript
    import Listener from 'advanced-extension-reloader-watch-2/umd/listener';

    new Listener().listen();
    ```

<h2 id="suspend_automatic_reload_en">Temporarily suspend automatic reload</h2>

You can temporarily suspend automatic reload by right-clicking on the browser action icon and selecting the *Suspend automatic reload* option. You can also do this with a hotkey specified at *chrome://extensions/shortcuts*.

<h2 id="sample_extensions_en">Sample extensions</h2>

Sample extensions can be found [here](https://github.com/loftyshaky/advanced-extension-reloader-examples).

<h2 id="api_en">API</h2>

| Property | Type | Default value | Applies to | Description |
| :--- | :--- | :--- | :--- | :--- |
| `hard` | `boolean` | `true` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Whether to reload an extension as opposed to just reloading the current tab. If set to `false`, the background script will not reload. The extension(s) won't reload on *manifest.json* changes even if this option is `true` unless you use `listen()` function from the **Advanced Extension Reloader Watch 2** supplementary package in the background script of the target extension. Can be combined with `all_tabs`. |
| `all_tabs` | `boolean` | `false` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Whether to reload all tabs as opposed to just reloading the current tab. |
| `ext_id` | `string` | `undefined` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | An id of an extension to reload in `hard` mode. If unspecified, all extensions will be reloaded. |
| `play_sound` | `boolean` | `false` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Whether to play a notification sound upon reload completion. |
| `after_reload_delay` | `number` | `1000` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | The amount of time in milliseconds to wait after an extension was reloaded before reloading closed tabs. If you experience any errors in your extension after its pages are reloaded or the extension's pages are reloaded blank, you may try to increase this value. |
| `port` | `number` | `7220` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | A port, that should expect messages to reload an extension. You will need multiple ports if you develop multiple extensions. 🚩 Important: the port defined here should be duplicated in the **Advanced Extension Reloader's** settings page. |
| `watch_dir` | `string` | src | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | A path to the directory to watch for file changes. Should be your extension's directory path. |
| `manifest_path` | `boolean` \| `string` | `false` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | A path to the extension's *manifest.json*. Can be a boolean, if `true` **Advanced Extension Reloader Watch 1/2** will look for *manifest.json* in the `watch_dir` directory. **Advanced Extension Reloader Watch 1/2** need this option to check the validity of *manifest* before reloading an extension. If the *manifest.json* is not valid, reload will be canceled so your extension doesn't crash. |
| `hard_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | An array of paths or partial paths (like file name). If an extension reload is triggered by a change in files/directories with one of these paths, it will reload with `hard`: `true` even if `hard`: `false` is specified in the config. |
| `soft_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | An array of paths or partial paths (like file name). If an extension reload is triggered by a change in files/directories with one of these paths, it will reload with `hard`: `false` even if `hard`: `true` is specified in the config. |
| `all_tabs_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | An array of paths or partial paths (like file name). If an extension reload is triggered by a change in files/directories with one of these paths, it will reload with `all_tabs`: `true` even if `all_tabs`: `false` is specified in the config. |
| `one_tab_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | An array of paths or partial paths (like file name). If an extension reload is triggered by a change in files/directories with one of these paths, it will reload with `all_tabs`: `false` even if `all_tabs`: `true` is specified in the config. |

<h2 id="build_steps_en">Build steps</h2>

1. git clone https://github.com/loftyshaky/advanced-extension-reloader
2. cd into the cloned repository
3. npm install
4. npm run prod (Chrome) / npm run prode (Edge)
</details>
<details>
<summary>Russian</summary>

## Ссылки

[Chrome Web Store](https://chromewebstore.google.com/detail/hagknokdofkmojolcpbddjfdjhnjdkae)<br>
[Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/bcpgohifjmmcoiemghdamamlkbcbgifg)

## О расширении
**Advanced Extension Reloader** - это браузерное расширение, которое перезагружает распакованные расширения разрабатываемые вами, за вас. Установив это расширение, вы сможете перезагрузить все распакованные расширения сразу, кликнув на иконку расширения. Вы также сможете:

★ Перезагружать расширение только с определенным id. 

★ Перезагружать расширение(я) с помощью горячей клавиш(и).

★ Настроить автоматическую перезагрузку при изменении файлов вашего расширения с помощью вспомогательных пакетов **Advanced Extension Reloader Watch 1** (если вы разрабатываете расширение без бандлера) или **Advanced Extension Reloader Watch 2** (если вы используете Webpack).

★ Настроить воспроизведение звукового оповещения по окончании перезагрузки вашего расширения/ваших расширений.

★ Настроить перезагрузку текущей вкладки или всех вкладок по окончании перезагрузки вашего расширения/ваших расширений. (полезно для расширений с content script).

После перезагрузки расширения(й) **Advanced Extension Reloader** повторно откроет все закрытые во время перезагрузки вкладки (например, страницу параметров вашего расширения(й)).

Ниже приводится подробное описание того, как использовать **Advanced Extension Reloader** и вспомогательные пакеты идущие с ним.

## Содержание
- [Ручная перезагрузка](#manual_reload_ru)
- [Автоматическая перезагрузка](#automatic_reload_ru)
- [Advanced Extension Reloader Watch 1 (автоматическая перезагрузка для расширений разрабатываемых БЕЗ ИСПОЛЬЗОВАНИЯ бандлера)](#advanced_extension_reloader_watch_1_no_bundler_ru)
- [Advanced Extension Reloader Watch 2 (автоматическая перезагрузка для расширений разрабатываемых С ИСПОЛЬЗОВАНИЕМ бандлера)](#advanced_extension_reloader_watch_2_bundler_ru)
- [Перезагрузка расширения при изменении manifest.json](#manifest_changes_reload_ru)
- [Временная приостановка автоматической перезагрузки](#suspend_automatic_reload_ru)
- [Примеры расширений](#sample_extensions_ru)
- [API](#api_ru)
- [Этапы сборки](#build_steps_ru)

<h2 id="manual_reload_ru">Ручная перезагрузка</h2>

Чтобы перезагрузить расширение(я), кликните на иконку расширения на панели инструментов или используйте горячую клавишу *Перезагрузить расширение (основное действие)*, которую можно настроить в *chrome://extensions/shortcuts*. Вы можете изменить, то как расширение будет перезагружаться отредактировав текстовое поле *Действие при клике на иконку расширения* в настройках расширения.

**Пример настроек:**
```javascript
{
    "all_tabs": false,
    "hard": true,
    "ext_id": "ffhljpfecjcfjdaneehmhdgplkaafnbb",
    "play_sound": true
}
```

Клик правой кнопкой мыши по иконке расширения отобразит меню с дополнительными действиями перезагрузки, которые можно изменить, отредактировав текстовое поле *Действия контекстного меню иконки расширения* на странице настроек.

Текстовое поле принимает массив объектов с той же схемой, что и в *Действие при клике на иконку расширения*. Имейте в виду, что количество элементов в контекстном меню ограничено. Вы также можете использовать эти действия перезагрузки, используя одну из горячих клавиш *Перезагрузить расширение X* (которые можно настроить в *chrome://extensions/shortcuts*), где *X* - позиция в массиве.

<h2 id="automatic_reload_ru">Автоматическая перезагрузка</h2>

Для автоматической перезагрузки расширения вам потребуются два дополнительных пакета: **Advanced Extension Reloader Watch 1** и **Advanced Extension Reloader Watch 2**. Чтобы их использовать, вам необходимо установить Node JS и менеджер пакетов npm.

<h2 id="advanced_extension_reloader_watch_1_no_bundler_ru">Advanced Extension Reloader Watch 1 (автоматическая перезагрузка для расширений разрабатываемых БЕЗ ИСПОЛЬЗОВАНИЯ бандлера)</h2>

Если вы разрабатываете расширение без бандлера, вам понадобится **Advanced Extension Reloader Watch 1**. Этот пакет будет следить за вашими файлами на предмет изменений и отправлять сообщение в **Advanced Extension Reloader**, чтобы оно могло перезагрузить ваше расширение.

**Как пользоваться Advanced Extension Reloader Watch 1:**

1. Установите пакет глобально, используя::
    ```shell
    npm install advanced-extension-reloader-watch-1 --global
    ```

2. Создайте *config.json* в любом месте на вашем компьютере (замените значение `ext_id` на id вашего расширения):
    ```json
    {
        "port": 6220,
        "watch_dir": "D:/Cloud/Projects/Advanced Extension Reloader Examples/advanced-extension-reloader-examples/no_bundler/extensions/manifest_3",
        "ext_id": "jepkffhnnekngedhempoflhcmoogpkph",
        "play_sound": true
    }
    ```
    🚩 Важно: заданный здесь порт должен быть продублирован на странице настроек **Advanced Extension Reloader**.

3. Откройте командную строку/терминал и выполните следующую команду:
    ```shell
    watch-ext --config path_to_your_config.json
    ```

<h2 id="advanced_extension_reloader_watch_2_bundler_ru">Advanced Extension Reloader Watch 2 (автоматическая перезагрузка для расширений разрабатываемых С ИСПОЛЬЗОВАНИЕМ бандлера)</h2>

Если вы разрабатываете расширение с бандлером, вам понадобится **Advanced Extension Reloader Watch 2**.<br>

**Как пользоваться Advanced Extension Reloader Watch 2:** в Webpack проекте:

1. Установите **Advanced Extension Reloader Watch 2**, используя:
    ```shell
    npm install advanced-extension-reloader-watch-2
    ```

2. Импортируйте *Reloader* в файл конфигурации Webpack:
    ```javascript
    const Reloader = require('advanced-extension-reloader-watch-2/umd/reloader');
    ```

3. Начните следить за изменениями файлов в папке *src* вашего проекта. Если вы хотите следить за другой папкой, используйте свойство `watch_dir`:
    ```javascript
    const reloader = new Reloader({
        port: 6223,
    });

    reloader.watch();
    ```
    🚩 Важно: заданный здесь порт должен быть продублирован на странице настроек **Advanced Extension Reloader**.

4. Добавьте следующий код в массив `plugins` (замените значение `ext_id` на id вашего расширения):
    ```javascript
    {
        apply: (compiler) => {
            compiler.hooks.done.tap('done', (stats) => {
                const an_error_occured = stats.compilation.errors.length !== 0;

                if (an_error_occured) {
                    reloader.play_error_notification();
                } else {
                    reloader.reload({
                        ext_id: 'dphafhlelejgffkmbmnmomfehnekdnlj',
                        play_sound: true,
                    });
                }
            });
        },
    },
    ```
    Функция `reloader.reload()` перезагружает ваше расширение.<br>
    Функция `reloader.play_error_notification()` позволяет воспроизводить звук уведомления об ошибке при сборке.

Пример файла конфигурации Webpack можно посмотреть [здесь](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/webpack/webpack.config.js)

<h2 id="manifest_changes_reload_ru">Перезагрузка расширения при изменении manifest.json</h2>

Если вы хотите, чтобы ваше расширение перезагружалось при изменении *manifest.json*, вам нужно будет использовать функцию `listen()` из дополнительного пакета **Advanced Extension Reloader Watch 2**.<br>

**Как её использовать:**

- Для случая без использования бандлера, скачайте *listener.js* [здесь](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/es/listener.js), если ваш background-скрипт является модулем ES, или [здесь](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/umd/listener.js) в противном случае.

- Для случая с использования Webpack, просто импортируйте модуль `listener` как показано ниже.

- Импортируйте `listener` в background-скрипт и вызовите функцию `listen()` следующим образом:
    ```javascript
    import Listener from 'advanced-extension-reloader-watch-2/umd/listener';

    new Listener().listen();
    ```

<h2 id="suspend_automatic_reload_ru">Временная приостановка автоматической перезагрузки</h2>

Вы можете временно приостановить автоматическую перезагрузку, кликнув правой кнопкой мыши на иконку расширения и выбрав опцию *Приостановить автоматическую перезагрузку*. Вы также можете сделать это с помощью горячей клавиши, которую можно настроить в *chrome://extensions/shortcuts*.

<h2 id="sample_extensions_ru">Примеры расширений</h2>

Примеры расширений можно найти [здесь](https://github.com/loftyshaky/advanced-extension-reloader-examples).

<h2 id="api_ru">API</h2>

| Свойство | Тип | Значение по-умолчанию | Применимо к | Описание |
| :--- | :--- | :--- | :--- | :--- |
| `hard` | `boolean` | `true` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Следует ли перезагружать расширение, а не просто текущую вкладку. Если установлено значение `false`, background-скрипт не будет перезагружен. Расширения не будут перезагружаться при изменении *manifest.json*, даже если установленно значение `true`, за исключением случая, когда вы используете функцию `listen()` из вспомогательного пакета **Advanced Extension Reloader Watch 2** в background-скрипте целевого расширения. Может быть совмещено со свойством `all_tabs`. |
| `all_tabs` | `boolean` | `false` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Следует ли перезагружать все вкладки, а не просто текущую. |
| `ext_id` | `string` | `undefined` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Id расширения для перезагрузки в `hard` режиме. Если значение опущено, будут перезагружены все расширения. |
| `play_sound` | `boolean` | `false` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Следует ли воспроизводить звук уведомления по завершении перезагрузки. |
| `after_reload_delay` | `number` | `1000` | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Время, в миллисекундах, которое следует ждать после перезагрузки расширения, перед перезагрузкой закрытых вкладок. Если у вас возникают ошибки в расширении после перезагрузки его страниц или страницы расширения загружаются пустыми, вы можете попробовать увеличить это значение. |
| `port` | `number` | `7220` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Порт, который должен ожидать сообщения для перезагрузки расширений. Если вы разрабатываете несколько расширений одновременно, вам понадобится несколько портов. 🚩 Важно: заданный здесь порт должен быть продублирован на странице настроек **Advanced Extension Reloader**. |
| `watch_dir` | `string` | src | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Путь к папке, за изменением файлов которой, следует следить. Этим значением должен быть путь к папке с вашим расширением. |
| `manifest_path` | `boolean` \| `string` | `false` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Путь к *manifest.json* расширения. Может быть boolean, если `true` **Advanced Extension Reloader Watch 1/2** будет искать manifest.json в `watch_dir`. Эта опция нужна **Advanced Extension Reloader Watch 1/2** для проверки корректности *manifest.json* перед перезагрузкой расширения. Если *manifest.json* некорректен, перезагрузка будет отменена, чтобы расширение не зависло. |
| `hard_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Массив путей или частичных путей (например, имен файлов). Если перезагрузка расширения вызвана изменением в этих файлах/папках, оно будет перезагружено с `hard`: `true`, даже если в этом файле конфигурации указано `hard`: `false`. |
| `soft_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Массив путей или частичных путей (например, имен файлов). Если перезагрузка расширения вызвана изменением в этих файлах/папках, оно будет перезагружено с `hard`: `false`, даже если в этом файле конфигурации указано `hard`: `true`. |
| `all_tabs_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Массив путей или частичных путей (например, имен файлов). Если перезагрузка расширения вызвана изменением в этих файлах/папках, оно будет перезагружено с all_tabs: true, даже если в этом файле конфигурации указано `all_tabs`: `false`. |
| `one_tab_paths` | `string[]` | `[]` | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Массив путей или частичных путей (например, имен файлов). Если перезагрузка расширения вызвана изменением в этих файлах/папках, оно будет перезагружено с `all_tabs`: `false`, даже если в этом файле конфигурации указано `all_tabs`: `true`. |

<h2 id="build_steps_ru">Этапы сборки</h2>

1. git clone https://github.com/loftyshaky/advanced-extension-reloader
2. cd в клонированный репозиторий
3. npm install
4. npm run prod (Chrome) / npm run prode (Edge)
</details>
