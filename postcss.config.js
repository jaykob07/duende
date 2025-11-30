// postcss.config.js
export default {
  plugins: {
    // ⚠️ CAMBIO CRUCIAL: Renombrado a @tailwindcss/postcss para v4
    '@tailwindcss/postcss': {}, 
    // Mantenemos autoprefixer
    autoprefixer: {},
  },
}