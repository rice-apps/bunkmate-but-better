export default function supabaseLoader({ src, width, quality }) {
  return `${src}?width=${width}&quality=${quality || 75}`
}