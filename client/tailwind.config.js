/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project structure
    "./public/index.html"
  ],
  theme: {
    extend: {
        colors: {
                'primary': '#00789a',
                'primary-dark': '#005067',
                'primary-light': '#00a0cd',
                'primary-content': '#9ae9ff',
                'secondary': '#6f009a',
                'secondary-dark': '#4a0067',
                'secondary-light': '#9400cd',
                'secondary-content': '#e39aff',
                'foreground': '#fbfbfb',
                'background': '#eff0f1',
                'border-color': '#dde0e2',
                'copy': '#232829',
                'copy-light': '#5e6a6e',
                'copy-lighter': '#849195',
                'success': '#009a00',
                'warning': '#9a9a00',
                'error': '#9a0000',
                'success-content': '#9aff9a',
                'warning-content': '#000000',
                'error-content': '#ff9a9a'
            }
        },
  },
  plugins: [],
}

