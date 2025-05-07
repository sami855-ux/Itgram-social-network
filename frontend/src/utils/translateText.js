import axios from "axios"

export const autoTranslate = async (text, toLang = "am", fromLang = "en") => {
  try {
    const res = await axios.post(import.meta.env.VITE_BASE_URL_TRANSLATE, {
      q: text,
      source: fromLang,
      target: toLang,
      format: "text",
    })
    return res.data.translatedText
  } catch (err) {
    console.error("Translation failed:", err.message)
    return text
  }
}
