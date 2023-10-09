/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/react'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()]
}

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//     './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  
//   ],
//   mode: "jit",
//   theme: {
//     extend: {
      // colors: {
      //   primary: "#00040f",
      //   secondary: "#00f6ff",
      //   dimWhite: "rgba(255, 255, 255, 0.7)",
      //   dimBlue: "rgba(9, 151, 124, 0.1)",
      // },
//       fontFamily: {
//         poppins: ["Poppins", "sans-serif"],
//       },
//     },
//     screens: {
//       xs: "480px",
//       ss: "620px",
//       sm: "768px",
//       md: "1060px",
//       lg: "1200px",
//       xl: "1700px",
//     },
//   },
//   darkMode: "class",
//   plugins: [nextui()]
// };