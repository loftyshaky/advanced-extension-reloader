const _ = require('lodash');

const min_items = 2;
const naming_convention_exceptions = {
    regex: '^(marginBottom|minWidth|maxWidth|scrollTop|backgroundColor|componentDidMount|componentWillUnmount|componentDidUpdate|componentDidCatch|getDerivedStateFromError|enforceActions|recurseEverything|currentWindow|windowTypes|defaultProps|windowId)$',
    match: false,
};

const rules = {
    js: {
        //> javascript
        'import/no-cycle': 'off',
        'import/named': 'off',
        'import/prefer-default-export': 'off',
        'prefer-arrow-callback': 'off',
        'func-names': 'off',
        'no-param-reassign': 'off',
        camelcase: 'off',
        indent: [
            'error',
            4,
        ],
        quotes: [
            2,
            'single',
            { avoidEscape: true },
        ],
        'max-len': [
            'error',
            100,
            2,
            {
                ignoreUrls: true,
                ignoreComments: true,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
        'max-depth': [
            'error',
            4,
        ],
        'max-nested-callbacks': [
            'error',
            4,
        ],
        'multiline-ternary': [
            'error',
            'always',
        ],
        'no-negated-condition': 'error',
        'linebreak-style': [
            'error',
            'windows',
        ],
        'array-bracket-newline': [
            'error',
            { minItems: min_items },
        ],
        'array-element-newline': [
            'error',
            { minItems: min_items },
        ],
        'object-curly-newline': [
            'error',
            { consistent: true },
        ],
        'object-property-newline': [
            'error',
            { allowAllPropertiesOnSameLine: false },
        ],
        'function-paren-newline': [
            'error',
            'consistent',
        ],
        'function-call-argument-newline': [
            'error',
            'always',
        ],
        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                prev: '*',
                next: 'return',
            },
        ],
        curly: [
            'error',
            'all',
        ],
        'spaced-comment': [
            'error',
            'always',
            {
                line: {
                    markers: [
                        '>',
                        '<',
                    ],
                },
                block: {
                    markers: ['*'],
                    balanced: true,
                },
            },
        ],
        'lines-between-class-members': [
            'error',
            'always',
            { exceptAfterSingleLine: true },
        ],
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: [
                    'js/*',
                    'js/*/**',
                    'rollup.config.js',
                    'webpack.config.js',
                ],
            },
        ],
        //< javascript
        //> react
        'react/no-array-index-key': 'off',
        'jsx-quotes': [
            'error',
            'prefer-single',
        ],
        //< react
    },
    ts: {
        //> typescript
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/indent': [
            'error',
            4,
            {
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
                FunctionDeclaration: {
                    parameters: 1,
                    body: 1,
                },
                FunctionExpression: {
                    parameters: 1,
                    body: 1,
                },
                CallExpression: { arguments: 1 },
                ArrayExpression: 1,
                ObjectExpression: 1,
                ImportDeclaration: 1,
                flatTernaryExpressions: false,
                ignoredNodes: [
                    'JSXElement',
                    'JSXElement > *',
                    'JSXAttribute',
                    'JSXIdentifier',
                    'JSXNamespacedName',
                    'JSXMemberExpression',
                    'JSXSpreadAttribute',
                    'JSXExpressionContainer',
                    'JSXOpeningElement',
                    'JSXClosingElement',
                    'JSXFragment',
                    'JSXOpeningFragment',
                    'JSXClosingFragment',
                    'JSXText',
                    'JSXEmptyExpression',
                    'JSXSpreadChild',
                ],
                ignoreComments: false,
            },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        'brace-style': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/brace-style': [
            'error',
            '1tbs',
            { allowSingleLine: true },
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'default',
                format: ['snake_case'],
                filter: naming_convention_exceptions,
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
            {
                selector: [
                    'variable',
                    'property',
                ],
                format: [
                    'snake_case',
                    'PascalCase',
                ],
                filter: naming_convention_exceptions,
            },
        ],
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/prefer-includes': 'error',
        //< typescript

        //> react
        'react/prefer-stateless-function': 'off',
        'react/jsx-filename-extension': 'off',
        'react/static-property-placement': 'off',
        'react/jsx-indent': [
            'error',
            4,
        ],
        'react/jsx-indent-props': [
            'error',
            4,
        ],
        //< react
    },
};

module.exports = {
    extends: [
        'airbnb',
        'airbnb/hooks',
    ],
    plugins: ['react'],
    parser: 'babel-eslint',
    rules: rules.js,
    overrides: [{
        extends: [
            'airbnb',
            'plugin:@typescript-eslint/recommended',
        ],
        parser: '@typescript-eslint/parser',
        files: [
            '*.ts',
            '*.tsx',
        ],
        parserOptions: { // requered for some rules to work, like for example: '@typescript-eslint/prefer-includes': 'error'
            project: 'tsconfig.json',
            tsconfigRootDir: __dirname,
        },
        settings: {
            'import/resolver': {
                typescript: {},
            },
        },
        rules: _.merge(
            {},
            rules.js,
            rules.ts,
        ),
    }],
    globals: {
        window: false,
        document: false,
        env: false,
        l: false,
        n: false,
        nu: false,
        s: false,
        sa: false,
        sb: false,
        sab: false,
        browser: false,
        page: false,
        show_dependencicies_from_other_page_loaded_into_this_page_alert: false,
        show_err_ribbon: false,
        err: false,
        err_async: false,
        throw_err: false,
        err_obj: false,
        doc: true,
        doc_state: false,
    },
};
