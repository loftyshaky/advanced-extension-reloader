<h1 id="advanced_extension_reloader">Advanced Extension Reloader</h2>

Браузерное расширение, позволяющее перезагружать распакованное расширение одним кликом, горячей клавишей или автоматически (расширение для разработчиков).

<h2 id="links">Ссылки</h2>

[README.md in English](https://github.com/loftyshaky/advanced-extension-reloader/blob/master/README.md)<br>
[Интернет-магазин Chrome](https://chromewebstore.google.com/detail/hagknokdofkmojolcpbddjfdjhnjdkae)<br>
[Надстройки Edge](https://microsoftedge.microsoft.com/addons/detail/bcpgohifjmmcoiemghdamamlkbcbgifg)

<h2 id="api_changes">Изменения API в Advanced Extension Reloader 2.0.0</h2>

Свойства `ext_id`, `play_sound` и `after_reload_delay` были переименованы в `extension_id`, `play_notifications` и `delay_after_extension_reload` соответственно. Эти изменения касаются **Advanced Extension Reloader**, **Advanced Extension Reloader Watch 1** и **Advanced Extension Reloader Watch 2**.

<h2 id="about">О расширении</h2>

**Advanced Extension Reloader** — это функциональное браузерное расширение, которое упрощает процесс разработки расширений, позволяя перезагружать распакованные расширения одним кликом, горячей клавишей или автоматически при изменении файлов. Расширение имеет звуковые уведомления, подтверждающие перезагрузку. Идеально подходит для разработчиков расширений, повышает эффективность и оптимизирует ваш рабочий процесс.

**Особенности:**

🎯 Перезагружайте конкретное расширение, указав его ID.

⌨️ Перезагружайте расширения с помощью горячей клавиши.

🔄 Настройте автоматическую перезагрузку ваших расширений при изменении их файлов, используя дополнительные npm-пакеты **Advanced Extension Reloader Watch 1** (для проектов без бандлера) или **Advanced Extension Reloader Watch 2** (для проектов с бандлером).

🔔 Получайте звуковые уведомления при успешной перезагрузке ваших расширений.

📄 Перезагружайте текущую вкладку или все открытые вкладки после перезагрузки ваших расширений (полезно для content script).

♻️ **Advanced Extension Reloader** также повторно откроет popup и любые вкладки, которые были закрыты во время процесса перезагрузки, такие как страница настроек вашего расширения.

Ниже представлено подробное руководство по использованию **Advanced Extension Reloader** и его дополнительных пакетов.

<h2 id="content">Содержание</h2>

- [Ручная перезагрузка](#manual_reload)
- [Автоматическая перезагрузка](#automatic_reload)
- [Advanced Extension Reloader Watch 1: Автоперезагрузка БЕЗ бандлера](#advanced_extension_reloader_watch_1_no_bundler)
- [Advanced Extension Reloader Watch 2: Автоперезагрузка С бандлером](#advanced_extension_reloader_watch_2_bundler)
- [Перезагрузка popup](#popup_reload)
- [Применение изменений в manifest.json при перезагрузке](#manifest_changes_reload)
- [Приостановка автоматической перезагрузки](#pause_automatic_reload)
- [Примеры расширений](#sample_extensions)
- [Аудиоуведомления](#audio_notifications)
- [Справочник API](#api)
- [Этапы сборки](#build_steps)

<h2 id="manual_reload">Ручная перезагрузка</h2>

Чтобы вручную перезагрузить расширение (расширения), нажмите на его иконку на панели инструментов или воспользуйтесь горячей клавишей _Активация расширения_, которую можно задать по адресу _chrome://extensions/shortcuts_. Вы можете настроить поведение перезагрузки, изменив поле _Действие при нажатии на иконку расширения_ на странице настроек.

**Пример настроек:**

```javascript
{
    "all_tabs": false,
    "hard": true,
    "extension_id": "dphafhlelejgffkmbmnmomfehnekdnlj",
    "play_notifications": true
}
```

Нажатие правой кнопкой мыши на иконку расширения даёт дополнительные варианты перезагрузки, которые вы можете настроить в поле _Действия контекстного меню иконки расширения_ на странице настроек.

Это поле принимает массив объектов, каждый из которых соответствует структуре, определённой в поле _Действие при нажатии на иконку расширения_. Кроме того, вы можете вызывать эти действия перезагрузки с помощью горячих клавиш _Перезагрузить расширение X_, задаваемых в _chrome://extensions/shortcuts_, где _X_ соответствует позиции действия в массиве + 1.

<h2 id="automatic_reload">Автоматическая перезагрузка</h2>

Для включения автоматической перезагрузки расширений вам понадобятся два дополнительных npm-пакета: **Advanced Extension Reloader Watch 1** и **Advanced Extension Reloader Watch 2**. Для их использования необходимо установить Node.js и менеджер пакетов npm.

<h2 id="advanced_extension_reloader_watch_1_no_bundler">Advanced Extension Reloader Watch 1: Автоперезагрузка БЕЗ бандлера</h2>

Для проектов без бандлера, используйте **Advanced Extension Reloader Watch 1**. Этот пакет следит за изменениями в ваших файлах и отправляет сообщения в **Advanced Extension Reloader** для запуска перезагрузки.<br>

**Как использовать:**

1. Установите пакет глобально:

    ```shell
    npm install advanced-extension-reloader-watch-1 --global
    ```

2. Создайте файл _config.json_ в любом месте на вашем компьютере. Замените `extension_id` на ID вашего расширения:

    ```json
    {
        "port": 6220,
        "watch_dir": "D:/Cloud/Projects/Advanced Extension Reloader Examples/advanced-extension-reloader-examples/no_bundler/extensions/manifest_3",
        "extension_id": "pacanmlfjnfoolpglkcpbpoiapkgpaph",
        "play_notifications": true
    }
    ```

    🚩 Важно: Указанный здесь порт должен быть продублирован на странице настроек **Advanced Extension Reloader**.

3. Откройте командную строку/терминал и выполните следующую команду:
    ```shell
    watch-ext --config path_to_your_config.json
    ```

<h2 id="advanced_extension_reloader_watch_2_bundler">Advanced Extension Reloader Watch 2: Автоперезагрузка С бандлером</h2>

Для проектов с бандлером, используйте **Advanced Extension Reloader Watch 2**.<br>

**Пример использования в проекте Vite/Webpack:**

1. Установите **Advanced Extension Reloader Watch 2**:

    ```shell
    npm install advanced-extension-reloader-watch-2
    ```

2. Импортируйте `Reloader` в файл конфигурации бандлера:

    **Пример конфигурации TypeScript Vite**:

    ```typescript
    import Reloader from 'advanced-extension-reloader-watch-2/es/reloader';
    ```

    **Пример конфигурации JavaScript Webpack**:

    ```javascript
    const Reloader = require('advanced-extension-reloader-watch-2/umd/reloader');
    ```

3. Начните отслеживание файлов в директории `src` вашего проекта:

    ```typescript
    const reloader = new Reloader({
        port: 6220,
    });

    reloader.watch();
    ```

    Чтобы отслеживать другую директорию, установите свойство `watch_dir`.

    🚩 Важно: Указанный здесь порт должен быть продублирован на странице настроек **Advanced Extension Reloader**.

4. Добавьте следующее значение в массив plugins в конфигурации бандлера. Замените extension_id на реальный ID расширения:

    **Пример Vite**:

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

    **Пример Webpack**:

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

    Функция `reloader.reload()` перезагружает ваше расширение, а `reloader.play_error_notification()` воспроизводит звуковое уведомление при ошибке сборки.

Полный пример конфигурации Vite можно посмотреть [здесь](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/vite/vite.config.ts), а пример конфигурации Webpack - [здесь](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/webpack/webpack.config.js).

<h2 id="popup_reload">Перезагрузка popup</h2>

Если вы выполните hard перезагрузку, в то время как popup открыт, **Advanced Extension Reloader** автоматически откроет его заново. Если вы хотите, чтобы popup всегда открывался, даже если он был закрытым до перезагрузки, установите свойство `always_open_popup` в значение true. Кроме того, с помощью `always_open_popup_paths` можно указать, какие пути к файлам должны вызывать постоянное открытие popup. Вам также необходимо будет указать `extension_id`, иначе перезагрузка popup не будет работать.

<h2 id="manifest_changes_reload">Применение изменений в manifest.json при перезагрузке</h2>

Для того чтобы изменения в файле _manifest.json_ применялись при перезагрузке вашего расширения, необходимо использовать функцию `listen()` из дополнительного пакета **Advanced Extension Reloader Watch 2**.<br>

**Как её использовать:**

- Для проектов без бандлера, загрузите подходящий файл listener.js в зависимости от типа вашего background-скрипта:

Если ваш background-скрипт является ES-модулем, загрузите файл [здесь](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/es/listener.js).<br>
Если ваш background-скрипт не является ES-модулем, загрузите файл [здесь](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/umd/listener.js).

- Для проектов с Webpack: Импортируйте `Listener` в background-скрипт и вызовите функцию `listen()` следующим образом:

    ```javascript
    import Listener from 'advanced-extension-reloader-watch-2/umd/listener';

    new Listener().listen();
    ```

<h2 id="pause_automatic_reload">Приостановка автоматической перезагрузки</h2>

Чтобы приостановить автоматическую перезагрузку, нажмите правой кнопкой мыши на иконку расширения и выберите опцию _Приостановить автоматическую перезагрузку_. Также можно использовать горячую клавишу _Приостановить/возобновить автоматическую перезагрузку_, которую можно задать по адресу _chrome://extensions/shortcuts_.

<h2 id="sample_extensions">Примеры расширений</h2>

Примеры расширений можно найти [здесь](https://github.com/loftyshaky/advanced-extension-reloader-examples).

<h2 id="audio_notifications">Аудиоуведомления</h2>

**Advanced Extension Reloader** имеет пять отличных друг от друга звуковых уведомлений. Вы можете прослушать каждое из них, перейдя по ссылкам ниже:

- [Успешная перезагрузка — расширение установлено](https://freesound.org/people/PaulMorek/sounds/330046): Воспроизводится после того, как расширение успешно перезагружено и подтверждено, что оно установлено в браузере.
- [Успешная перезагрузка — расширение НЕ установлено](https://freesound.org/people/PaulMorek/sounds/330056): Воспроизводится после попытки перезагрузки расширения и выявления того, что оно не установлено в браузере.
- [Ошибка перезагрузки — расширение установлено](https://freesound.org/people/PaulMorek/sounds/330068): Воспроизводится при вызове `reloader.play_error_notification()` и выявлении того, что расширение установлено в браузере.
- [Ошибка перезагрузки — расширение НЕ установлено](https://freesound.org/people/PaulMorek/sounds/330067): Воспроизводится при вызове `reloader.play_error_notification()` и выявлении того, что расширение не установлено в браузере.
- [Ошибка manifest](https://freesound.org/people/PaulMorek/sounds/330065): Воспроизводится, когда обнаружено, что файл `manifest.json` недействителен.

<h2 id="api">Справочник API</h2>

| Свойство                                 | Тип                   | Значение по умолчанию | Применимо к                                                                                           | Описание                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :--------------------------------------- | :-------------------- | :-------------------- | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hard`                                   | `boolean`             | `true`                | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Определяет, нужно ли перезагружать расширение полностью (`true`) или только текущую вкладку (`false`). Если установлено значение `false`, изменения в background-скрипте не будут применяться.<br><br>Даже если установлено значение `true`, изменения в _файле manifest.json_ не будут применяться, если только вы не используете функцию `listen()` из дополнительного npm-пакета **Advanced Extension Reloader Watch 2** в background-скрипте вашего расширения.<br><br>Эта опция может использоваться в сочетании с `all_tabs`.                                             |
| `all_tabs`                               | `boolean`             | `false`               | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Указывает, нужно ли перезагружать все открытые вкладки, а не только текущую.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `always_open_popup`                      | `boolean`             | `false`               | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Определяет, нужно ли открывать popup после `hard` перезагрузки расширения. Это свойство управляет открытием popup только в том случае, если он был закрытым до перезагрузки. Даже при значении `false` **Advanced Extension Reloader** автоматически откроет popup, если он был открытым во время перезагрузки. Эта опция будет работать только в том случае, если вы также укажете `extension_id`.                                                                                                                                                                             |
| `extension_id`                           | `string`              | `undefined`           | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Определяет ID расширения, которое нужно перезагружать. Если оставить этот параметр `undefined`, будут перезагружаться все расширения.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `play_notifications`                     | `boolean`             | `false`               | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Указывает, следует ли воспроизводить звуковые уведомления при успешной/неуспешной перезагрузке и при успешной сборке.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `min_interval_between_extension_reloads` | `number`              | `500`                 | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Определяет минимальный промежуток времени между перезагрузками расширения, гарантируя, что **Advanced Extension Reloader** запустит перезагрузку не более одного раза за этот период.                                                                                                                                                                                                                                                                                                                                                                                           |
| `delay_after_extension_reload`           | `number`              | `1000`                | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Указывает задержку в миллисекундах после перезагрузки расширения, прежде чем открывать все закрытые вкладки.<br><br>Если ваше расширение сталкивается с проблемами, такими как ошибки или пустые страницы после перезагрузки, вы можете увеличить это значение.                                                                                                                                                                                                                                                                                                                 |
| `delay_after_tab_reload`                 | `number`              | `2000`                | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Указывает задержку в миллисекундах после повторного открытия вкладок расширения, прежде чем его снова можно будет перезагрузить.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `listen_message_response_timeout`        | `number`              | `400`                 | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Определяет время ожидания ответа от вашего расширения при использовании функции `listen()`. В процессе этого **Advanced Extension Reloader** отправляет сообщение в background-скрипт вашего расширения для выполнения перезагрузки с помощью `runtime.reload()`. Если ответ не получен (например, если service worker не отвечает), **Advanced Extension Reloader** принудительно перезагрузит расширение с помощью `management.setEnabled`.                                                                                                                                   |
| `port`                                   | `number`              | `7220`                | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | **Advanced Extension Reloader Watch 1/2** создает сервер, который прослушивает указанный вами порт и принимает подключения от **Advanced Extension Reloader**.<br><br>**Advanced Extension Reloader** подключается к этому серверу, используя этот порт, и ожидает события перезагрузки.<br><br>Когда событие перезагрузки получено, оно автоматически перезагружает расширение, над которым вы работаете.<br><br>🚩 Важно: Порт должен быть настроен как в конфигурации **Advanced Extension Reloader Watch 1/2**, так и на странице настроек **Advanced Extension Reloader**. |
| `watch_dir`                              | `string`              | src                   | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Путь к директории, в которой нужно следить за изменениями файлов. Это должен быть путь к директории с вашим расширением.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `manifest_path`                          | `boolean` \| `string` | `false`               | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Путь к _manifest.json_ расширения: Может быть boolean значением или как путь к директории. Если установлено значение `true`, **Advanced Extension Reloader Watch 1/2** автоматически будет искать _manifest.json_ в директории `watch_dir`.<br><br>Эта опция необходима для того, чтобы **Advanced Extension Reloader Watch 1/2** мог проверить корректность _manifest.json_ перед перезагрузкой расширения. Если _manifest.json_ окажется недействительным, процесс перезагрузки будет отменен, чтобы предотвратить падение расширения.                                        |
| `hard_paths`                             | `string[]`            | `[]`                  | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Массив путей или частичных путей (например, имен файлов). Если в каком-либо файле или директории, совпадающем с этими путями, произойдет изменение, расширение будет перезагружено с `hard`: `true`, даже если в конфигурации указано `hard`: `false`.                                                                                                                                                                                                                                                                                                                          |
| `soft_paths`                             | `string[]`            | `[]`                  | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Массив путей или частичных путей (например, имен файлов). Если в каком-либо файле или директории, совпадающем с этими путями, произойдет изменение, расширение будет перезагружено с `hard`: `false`, даже если в конфигурации указано `hard`: `true`.                                                                                                                                                                                                                                                                                                                          |
| `all_tabs_paths`                         | `string[]`            | `[]`                  | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Массив путей или частичных путей (например, имен файлов). Если в каком-либо файле или директории, совпадающем с этими путями, произойдет изменение, расширение будет перезагружено с `all_tabs`: `true`, даже если в конфигурации указано `all_tabs`: `false`.                                                                                                                                                                                                                                                                                                                  |
| `one_tab_paths`                          | `string[]`            | `[]`                  | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Массив путей или частичных путей (например, имен файлов). Если в каком-либо файле или директории, совпадающем с этими путями, произойдет изменение, расширение будет перезагружено с `all_tabs`: `false`, даже если в конфигурации указано `all_tabs`: `true`.                                                                                                                                                                                                                                                                                                                  |
| `always_open_popup_paths`                | `string[]`            | `[]`                  | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Массив путей или частичных путей (например, имен файлов). Если в каком-либо файле или директории, совпадающем с этими путями, произойдет изменение, popup расширения будет открыт, даже если он был закрытым до перезагрузки.                                                                                                                                                                                                                                                                                                                                                   |

<h2 id="build_steps">Этапы сборки</h2>

1. git clone https://github.com/loftyshaky/advanced-extension-reloader
2. cd в клонированный репозиторий
3. npm install
4. npm run prod (Chrome) / npm run prode (Edge)
