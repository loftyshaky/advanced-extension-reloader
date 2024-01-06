<h1 id="advanced_extension_reloader">Advanced Extension Reloader</h2>

<h2 id="links">Ссылки</h2>

[README.md in English](https://github.com/loftyshaky/advanced-extension-reloader/blob/master/README.md)<br>
[Интернет-магазин Chrome](https://chromewebstore.google.com/detail/hagknokdofkmojolcpbddjfdjhnjdkae)<br>
[Надстройки Edge](https://microsoftedge.microsoft.com/addons/detail/bcpgohifjmmcoiemghdamamlkbcbgifg)

<h2 id="about">О расширении</h2>

**Advanced Extension Reloader** - это браузерное расширение, которое перезагружает распакованные расширения разрабатываемые вами, за вас. Установив это расширение, вы сможете перезагрузить все распакованные расширения сразу, кликнув на иконку расширения. Вы также сможете:

★ Перезагружать расширение только с определенным id. 

★ Перезагружать расширение(я) с помощью горячей клавиш(и).

★ Настроить автоматическую перезагрузку при изменении файлов вашего расширения с помощью вспомогательных пакетов **Advanced Extension Reloader Watch 1** (если вы разрабатываете расширение без бандлера) или **Advanced Extension Reloader Watch 2** (если вы используете Webpack).

★ Настроить воспроизведение звукового оповещения по окончании перезагрузки вашего расширения/ваших расширений.

★ Настроить перезагрузку текущей вкладки или всех вкладок по окончании перезагрузки вашего расширения/ваших расширений. (полезно для расширений с content script).

После перезагрузки расширения(й) **Advanced Extension Reloader** повторно откроет все закрытые во время перезагрузки вкладки (например, страницу параметров вашего расширения(й)).

Ниже приводится подробное описание того, как использовать **Advanced Extension Reloader** и вспомогательные пакеты идущие с ним.

<h2 id="content">Содержание</h2>

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
