// TranslatableText.js
import { useEffect, useState } from "react"
import getTranslation from "./translateText"

export const TranslatableText = ({ text, language }) => {
  const [translated, setTranslated] = useState(text)

  const srcLang = language === "am" ? "en" : "am"
  useEffect(() => {
    const doTranslate = async () => {
      try {
        if (language === "en") {
          setTranslated(text)
        } else {
          const result = await getTranslation(text, srcLang, language)
          setTranslated(result)
        }
      } catch (err) {
        console.error("Translation error:", err)
      }
    }

    doTranslate()
  }, [language, text, srcLang])

  return <>{translated}</>
}
