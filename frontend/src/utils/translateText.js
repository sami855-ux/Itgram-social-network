import axios from "axios"

export default async function getTranslation(text, srcLang, destLang) {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL_TRANSLATE,
      {
        text: text,
        src: srcLang,
        dest: destLang,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    // The translated text is in response.data.translated_text
    console.log("Translated text:", response.data.translated_text)
    return response.data.translated_text
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message)
    throw error // Re-throw if you want calling code to handle it
  }
}
