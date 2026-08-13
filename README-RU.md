# Advanced Extension Reloader

Браузерное расширение, позволяющее перезагружать распакованное расширение одним кликом, горячей клавишей или автоматически (расширение для разработчиков).

## Ссылки

[README.md in English](https://github.com/loftyshaky/advanced-extension-reloader/blob/master/README.md)<br>
[Интернет-магазин Chrome](https://chromewebstore.google.com/detail/hagknokdofkmojolcpbddjfdjhnjdkae)<br>
[Надстройки Edge](https://microsoftedge.microsoft.com/addons/detail/bcpgohifjmmcoiemghdamamlkbcbgifg)<br>
[Дополнения для Firefox](https://google.com)


## Firefox

**Advanced Extension Reloader** теперь доступен для [Firefox](https://google.com)! Перед использованием обязательно ознакомьтесь с разделом [Особенности работы в Firefox](#особенности-работы-в-firefox).

## Изменения API в Advanced Extension Reloader Watch 2 3.0.0

Версия 3.0.0 **Advanced Extension Reloader Watch 2** представляет упрощённую систему импорта. Теперь модуль автоматически определяет подходящий формат за вас, избавляя от необходимости выбирать между ES и UMD сборками.

**Изменения в импорте Reloader:**

Ранее вам приходилось импортировать `Reloader` из директории `es` или `umd`:

```typescript
import Reloader from 'advanced-extension-reloader-watch-2/es/reloader';
```

или:

```typescript
import Reloader from 'advanced-extension-reloader-watch-2/umd/reloader';
```
Теперь импортируйте `Reloader` следующим образом:

```typescript
import { Reloader } from 'advanced-extension-reloader-watch-2/reloader';
```

Пакет автоматически определяет ваше окружение и подставляет соответствующий формат.

**Изменения в импорте Listener:**

Импорт `Listener` также был упрощён. Ранее вам нужно было импортировать `Listener` и вручную вызывать `listen()`:

```typescript
import Listener from 'advanced-extension-reloader-watch-2/umd/listener';

new Listener().listen();
```

Теперь `listener` активируется автоматически при импорте. Просто добавьте эту строку в ваш background-скрипт:

```typescript
import 'advanced-extension-reloader-watch-2/listener';
```

Шаг с `new Listener().listen();` больше не требуется.

**Для проектов без бандлера:**

Если вы используете **Advanced Extension Reloader Watch-1** без бандлера, замените существующий файл `listener.js` на один из следующих:

[ES](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/listener.es.mjs)<br>
[UMD](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/listener.umd.js)

## О расширении

**Advanced Extension Reloader** — это функциональное браузерное расширение, которое упрощает процесс разработки расширений, позволяя перезагружать распакованные расширения одним кликом, горячей клавишей или автоматически при изменении файлов. Расширение имеет звуковые уведомления, подтверждающие перезагрузку. Идеально подходит для разработчиков расширений, повышает эффективность и оптимизирует ваш рабочий процесс.

**Особенности:**

🎯 Перезагружайте конкретное расширение, указав его ID.

⌨️ Перезагружайте расширения с помощью горячей клавиши.

🔄 Настройте автоматическую перезагрузку ваших расширений при изменении их файлов, используя дополнительные npm-пакеты **Advanced Extension Reloader Watch 1** (для проектов без бандлера) или **Advanced Extension Reloader Watch 2** (для проектов с бандлером).

🔔 Получайте звуковые уведомления при успешной перезагрузке ваших расширений.

📄 Перезагружайте текущую вкладку или все открытые вкладки после перезагрузки ваших расширений (полезно для content script).

♻️ **Advanced Extension Reloader** также повторно откроет popup и любые вкладки, которые были закрыты во время процесса перезагрузки, такие как страница настроек вашего расширения.

Ниже представлено подробное руководство по использованию **Advanced Extension Reloader** и его дополнительных пакетов.

## Содержание

- [Ручная перезагрузка](#ручная-перезагрузка)
- [Автоматическая перезагрузка](#автоматическая-перезагрузка)
- [Advanced Extension Reloader Watch 1: Автоперезагрузка БЕЗ бандлера](#advanced-extension-reloader-watch-1-автоперезагрузка-без-бандлера)
- [Advanced Extension Reloader Watch 2: Автоперезагрузка С бандлером](#advanced-extension-reloader-watch-2-автоперезагрузка-с-бандлером)
- [Перезагрузка popup](#перезагрузка-popup)
- [Применение изменений в manifest.json при перезагрузке](#применение-изменений-в-manifestjson-при-перезагрузке)
- [Приостановка автоматической перезагрузки](#приостановка-автоматической-перезагрузки)
- [Примеры расширений](#примеры-расширений)
- [Аудиоуведомления](#аудиоуведомления)
- [Особенности работы в Firefox](#особенности-работы-в-firefox)
- [Справочник API](#справочник-api)
- [Этапы сборки](#этапы-сборки)

## Ручная перезагрузка

Чтобы вручную перезагрузить расширение (расширения), нажмите на его иконку на панели инструментов или воспользуйтесь горячей клавишей _Активация расширения_, которую можно задать по адресу _chrome://extensions/shortcuts_. Вы можете настроить поведение перезагрузки, изменив поле _Действие при нажатии на иконку расширения_ на странице настроек.

**Пример настроек:**

```json
{
    "all_tabs": false,
    "hard": true,
    "extension_id": "pacanmlfjnfoolpglkcpbpoiapkgpaph",
    "play_notifications": true
}
```

Нажатие правой кнопкой мыши на иконку расширения даёт дополнительные варианты перезагрузки, которые вы можете настроить в поле _Действия контекстного меню иконки расширения_ на странице настроек.

Это поле принимает массив объектов, каждый из которых соответствует структуре, определённой в поле _Действие при нажатии на иконку расширения_. Кроме того, вы можете вызывать эти действия перезагрузки с помощью горячих клавиш _Перезагрузить расширение X_, задаваемых в _chrome://extensions/shortcuts_, где _X_ соответствует позиции действия в массиве + 1.

## Автоматическая перезагрузка

Для включения автоматической перезагрузки расширений вам понадобятся два дополнительных npm-пакета: **Advanced Extension Reloader Watch 1** и **Advanced Extension Reloader Watch 2**. Для их использования необходимо установить Node.js и менеджер пакетов npm.

## Advanced Extension Reloader Watch 1: Автоперезагрузка БЕЗ бандлера

Для проектов без бандлера, используйте **Advanced Extension Reloader Watch 1**. Этот пакет следит за изменениями в ваших файлах и отправляет сообщения в **Advanced Extension Reloader** для запуска перезагрузки.<br>

**Как использовать:**

1. Установите пакет глобально:

    ```shell
    npm install advanced-extension-reloader-watch-1 --global
    ```

2. Создайте файл _config.json_ в любом месте на вашем компьютере. Замените `extension_id` на ID вашего расширения:

    ```json
    {
        "port": 6222,
        "watch_dir": "D:/Cloud/Projects/Advanced Extension Reloader Examples/advanced-extension-reloader-examples/no_bundler/extensions/manifest_3_es",
        "extension_id": "pacanmlfjnfoolpglkcpbpoiapkgpaph",
        "play_notifications": true
    }
    ```

    🚩 Важно: Указанный здесь порт должен быть продублирован на странице настроек **Advanced Extension Reloader**.

3. Откройте командную строку/терминал и выполните следующую команду:
    ```shell
    watch-ext --config path_to_your_config.json
    ```

## Advanced Extension Reloader Watch 2: Автоперезагрузка С бандлером

Для проектов с бандлером, используйте **Advanced Extension Reloader Watch 2**.<br>

**Пример использования в проекте Vite/Webpack:**

1. Установите **Advanced Extension Reloader Watch 2**:

    ```shell
    npm install advanced-extension-reloader-watch-2
    ```

2. Импортируйте `Reloader` в файл конфигурации бандлера:

    ```typescript
    import { Reloader } from 'advanced-extension-reloader-watch-2/reloader';
    ```

3. Начните отслеживание файлов в директории `src` вашего проекта:

    ```typescript
    const reloader = new Reloader({ port: 6220 });

    reloader.watch();
    ```

    Чтобы отслеживать другую директорию, установите свойство `watch_dir`.

    🚩 Важно: Указанный здесь порт должен быть продублирован на странице настроек **Advanced Extension Reloader**.

4. Добавьте следующее значение в массив plugins в конфигурации бандлера. Замените extension_id на реальный ID расширения:

    **Пример Vite**:

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

    **Пример Webpack**:

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

    Метод `reloader.reload()` перезагружает ваше расширение, а `reloader.play_error_notification()` воспроизводит звуковое уведомление при ошибке сборки.

Полный пример конфигурации Vite можно посмотреть [здесь](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/vite/vite.config.ts), а пример конфигурации Webpack - [здесь](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/webpack/webpack.config.js).

## Перезагрузка popup

Если вы выполните hard перезагрузку, в то время как popup открыт, **Advanced Extension Reloader** автоматически откроет его заново. Если вы хотите, чтобы popup всегда открывался, даже если он был закрытым до перезагрузки, установите свойство `always_open_popup` в значение true. Кроме того, с помощью `always_open_popup_paths` можно указать, какие пути к файлам должны вызывать постоянное открытие popup. Вам также необходимо будет указать `extension_id`, иначе перезагрузка popup не будет работать.

## Применение изменений в manifest.json при перезагрузке

Для того чтобы изменения в файле _manifest.json_ применялись при перезагрузке вашего расширения, необходимо использовать модуль `listen` из дополнительного пакета **Advanced Extension Reloader Watch 2**.<br>

**Как её использовать:**

- Для проектов без бандлера, загрузите подходящий файл listener.js в зависимости от типа вашего background-скрипта:

Если ваш background-скрипт является ES-модулем, загрузите файл [здесь](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/listener.es.mjs).<br>
Если ваш background-скрипт не является ES-модулем, загрузите файл [здесь](https://raw.githubusercontent.com/loftyshaky/advanced-extension-reloader-watch-2/master/dist/listener.umd.js).

- Для проектов с бандлером, импортируйте listener в ваш background-скрипт следующим образом:

    ```typescript
    import 'advanced-extension-reloader-watch-2/listener';
    ```

## Приостановка автоматической перезагрузки

Чтобы приостановить автоматическую перезагрузку, нажмите правой кнопкой мыши на иконку расширения и выберите опцию _Приостановить автоматическую перезагрузку_. Также можно использовать горячую клавишу _Приостановить/возобновить автоматическую перезагрузку_, которую можно задать по адресу _chrome://extensions/shortcuts_.

## Примеры расширений

Примеры расширений можно найти [здесь](https://github.com/loftyshaky/advanced-extension-reloader-examples).

## Аудиоуведомления

**Advanced Extension Reloader** имеет пять отличных друг от друга звуковых уведомлений. Вы можете прослушать каждое из них, перейдя по ссылкам ниже:

- [Успешная перезагрузка — расширение установлено и включено](https://freesound.org/people/PaulMorek/sounds/330046): Воспроизводится после того, как расширение успешно перезагружено и подтверждено, что оно установлено и включено в браузере.
- [Успешная перезагрузка — расширение НЕ установлено или выключено](https://freesound.org/people/PaulMorek/sounds/330056): Воспроизводится после попытки перезагрузки расширения и выявления того, что оно не установлено или выключено в браузере.
- [Ошибка перезагрузки — расширение установлено и включено](https://freesound.org/people/PaulMorek/sounds/330068): Воспроизводится при вызове `reloader.play_error_notification()` и выявлении того, что расширение установлено и включено в браузере.
- [Ошибка перезагрузки — расширение НЕ установлено или выключено](https://freesound.org/people/PaulMorek/sounds/330067): Воспроизводится при вызове `reloader.play_error_notification()` и выявлении того, что расширение не установлено или выключено в браузере.
- [Ошибка manifest](https://freesound.org/people/StavSounds/sounds/701704): Воспроизводится, когда обнаружено, что файл `manifest.json` недействителен.

## Особенности работы в Firefox

Перезагрузка расширений в Firefox требует особого подхода. Чтобы обеспечить работу как ручной, так и автоматической перезагрузки, необходимо подключить модуль `listener`, описанный [выше](#применение-изменений-в-manifestjson-при-перезагрузке). Без него перезагрузка работать не будет.

Для автоматической перезагрузки также потребуется указать Внутренний UUID расширения **Advanced Extension Reloader**. Этот идентификатор можно найти на странице `about:debugging#/runtime/this-firefox`. Передайте его в конфигурацию или конструктор `Reloader` с помощью свойства `firefox_advanced_extension_reloader_internal_uuids`:

**Advanced Extension Reloader Watch 1**

```json
{
    "port": 6225,
    "watch_dir": "D:/Cloud/Projects/Advanced Extension Reloader Examples/advanced-extension-reloader-examples/no_bundler/extensions/firefox_manifest_3_es",
    "firefox_advanced_extension_reloader_internal_uuids": [
        "b3bca27c-ef23-4759-bc14-fc88d04b9541"
    ],
    "extension_id": "firefox-manifest-3-extension-example-es@loftyshaky",
    "play_notifications": true,
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

Обратите внимание, что `extension_id` — это другой идентификатор, который должен соответствовать ID, указанному в вашем `manifest.json` (`browser_specific_settings > gecko > id`).

⚠️ **Важно:** Этот UUID уникален для каждого профиля Firefox. Вам потребуется обновить его при смене профиля или работе на другом компьютере. Свойство `firefox_advanced_extension_reloader_internal_uuids` принимает массив, поэтому при необходимости вы можете передать несколько UUID.

Полные примеры конфигурации можно найти [здесь](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/no_bundler/config/firefox_manifest_3_es.json) для **Advanced Extension Reloader Watch 1** и [здесь](https://github.com/loftyshaky/advanced-extension-reloader-examples/blob/main/vite_firefox/vite.config.ts) для **Advanced Extension Reloader Watch 2**. Чтобы эти примеры заработали, замените `your_advanced_extension_reloader_internal_uuid` на ваш актуальный Внутренний UUID.

## Справочник API

| Свойство                                 | Тип                   | Значение по умолчанию | Применимо к                                                                                           | Описание                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :--------------------------------------- | :-------------------- | :-------------------- | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hard`                                   | `boolean`             | `true`                | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Определяет, нужно ли перезагружать расширение полностью (`true`) или только текущую вкладку (`false`). Если установлено значение `false`, изменения в background-скрипте не будут применяться.<br><br>Даже если установлено значение `true`, изменения в _файле manifest.json_ не будут применяться, если только вы не используете модуль `listen` из дополнительного npm-пакета **Advanced Extension Reloader Watch 2** в background-скрипте вашего расширения.<br><br>Эта опция может использоваться в сочетании с `all_tabs`.                                             |
| `all_tabs`                               | `boolean`             | `false`               | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Указывает, нужно ли перезагружать все открытые вкладки, а не только текущую.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `always_open_popup`                      | `boolean`             | `false`               | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Определяет, нужно ли открывать popup после `hard` перезагрузки расширения. Это свойство управляет открытием popup только в том случае, если он был закрытым до перезагрузки. Даже при значении `false` **Advanced Extension Reloader** автоматически откроет popup, если он был открытым во время перезагрузки. Эта опция будет работать только в том случае, если вы также укажете `extension_id`.                                                                                                                                                                             |
| `extension_id`                           | `string`              | `undefined`           | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Определяет ID расширения, которое нужно перезагружать. Если оставить этот параметр `undefined`, будут перезагружаться все расширения.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `play_notifications`                     | `boolean`             | `false`               | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Указывает, следует ли воспроизводить звуковые уведомления при успешной/неуспешной перезагрузке или сборке.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `min_interval_between_extension_reloads` | `number`              | `500`                 | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Определяет минимальный промежуток времени в миллисекундах между перезагрузками расширения, гарантируя, что **Advanced Extension Reloader** запустит перезагрузку не более одного раза за этот период.                                                                                                                                                                                                                                                                                                                                                                                           |
| `delay_after_extension_reload`           | `number`              | `1000`                | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Указывает задержку в миллисекундах после перезагрузки расширения, прежде чем открывать все закрытые вкладки.<br><br>Если ваше расширение сталкивается с проблемами, такими как ошибки или пустые страницы после перезагрузки, вы можете увеличить это значение.                                                                                                                                                                                                                                                                                                                 |
| `delay_after_tab_reload`                 | `number`              | `2000`                | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Указывает задержку в миллисекундах после повторного открытия вкладок расширения, прежде чем его снова можно будет перезагрузить.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `listen_message_response_timeout`        | `number`              | `400`                 | Advanced Extension Reloader, Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2 | Определяет время ожидания ответа от вашего расширения при использовании модуля `listen`. В процессе этого **Advanced Extension Reloader** отправляет сообщение в background-скрипт вашего расширения для выполнения перезагрузки с помощью `runtime.reload()`. Если ответ не получен (например, если service worker не отвечает), **Advanced Extension Reloader** принудительно перезагрузит расширение с помощью `management.setEnabled`.                                                                                                                                   |
| `port`                                   | `number`              | `7220`                | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | **Advanced Extension Reloader Watch 1/2** создает сервер, который прослушивает указанный вами порт и принимает подключения от **Advanced Extension Reloader**.<br><br>**Advanced Extension Reloader** подключается к этому серверу, используя этот порт, и ожидает события перезагрузки.<br><br>Когда событие перезагрузки получено, оно автоматически перезагружает расширение, над которым вы работаете.<br><br>🚩 Важно: Порт должен быть настроен как в конфигурации **Advanced Extension Reloader Watch 1/2**, так и на странице настроек **Advanced Extension Reloader**. |
| `watch_dir`                              | `string`              | `src`                   | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Путь к директории, в которой нужно следить за изменениями файлов. Это должен быть путь к директории с вашим расширением.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `firefox_advanced_extension_reloader_internal_uuids`                              | `string[]`              | `[]`           | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Внутренние UUID установки **Advanced Extension Reloader** для Firefox. Необходимы для автоматической перезагрузки в Firefox.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `manifest_path`                          | `boolean` \| `string` | `false`               | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Путь к _manifest.json_ расширения: Может быть boolean значением или как путь к директории. Если установлено значение `true`, **Advanced Extension Reloader Watch 1/2** автоматически будет искать _manifest.json_ в директории `watch_dir`.<br><br>Эта опция необходима для того, чтобы **Advanced Extension Reloader Watch 1/2** мог проверить корректность _manifest.json_ перед перезагрузкой расширения. Если _manifest.json_ окажется недействительным, процесс перезагрузки будет отменен, чтобы предотвратить падение расширения.                                        |
| `hard_paths`                             | `string[]`            | `[]`                  | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Массив путей или частичных путей (например, имен файлов). Если в каком-либо файле или директории, совпадающем с этими путями, произойдет изменение, расширение будет перезагружено с `hard`: `true`, даже если в конфигурации указано `hard`: `false`.                                                                                                                                                                                                                                                                                                                          |
| `soft_paths`                             | `string[]`            | `[]`                  | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Массив путей или частичных путей (например, имен файлов). Если в каком-либо файле или директории, совпадающем с этими путями, произойдет изменение, расширение будет перезагружено с `hard`: `false`, даже если в конфигурации указано `hard`: `true`.                                                                                                                                                                                                                                                                                                                          |
| `all_tabs_paths`                         | `string[]`            | `[]`                  | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Массив путей или частичных путей (например, имен файлов). Если в каком-либо файле или директории, совпадающем с этими путями, произойдет изменение, расширение будет перезагружено с `all_tabs`: `true`, даже если в конфигурации указано `all_tabs`: `false`.                                                                                                                                                                                                                                                                                                                  |
| `one_tab_paths`                          | `string[]`            | `[]`                  | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Массив путей или частичных путей (например, имен файлов). Если в каком-либо файле или директории, совпадающем с этими путями, произойдет изменение, расширение будет перезагружено с `all_tabs`: `false`, даже если в конфигурации указано `all_tabs`: `true`.                                                                                                                                                                                                                                                                                                                  |
| `always_open_popup_paths`                | `string[]`            | `[]`                  | Advanced Extension Reloader Watch 1, Advanced Extension Reloader Watch 2                              | Массив путей или частичных путей (например, имен файлов). Если в каком-либо файле или директории, совпадающем с этими путями, произойдет изменение, popup расширения будет открыт, даже если он был закрытым до перезагрузки.                                                                                                                                                                                                                                                                                                                                                   |

## Этапы сборки

1. `git clone https://github.com/loftyshaky/advanced-extension-reloader`
2. `cd` в клонированный репозиторий
3. `npm install`
4. `npm run prod_test` (Chrome) / `npm run prod_test_edge` (Edge) / `npm run prod_test_opera` (Opera) / `npm run prod_test_brave` (Brave) / `npm run prod_test_yandex` (Яндекс Браузер) / `npm run prod_test_firefox` (Firefox)
