import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([

  globalIgnores(['dist']),

  {
    files: ['**/*.{js,jsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },

      globals: globals.browser
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y
    },

    settings: {
      react: {
        version: 'detect'
      }
    },

    rules: {

      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,


      // React 17+ fix
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',


      // unused vars
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z_]'
        }
      ],


      // accessibility rules
      'jsx-a11y/alt-text': 'warn',
      'react/jsx-no-target-blank': 'warn'

    }
  }

])
