import axios from "axios"

const key = "YOUR_TRANSLATOR_KEY"
const endpoint = "https://api.cognitive.microsofttranslator.com"
const region = "YOUR_RESOURCE_REGION" // e.g. "eastus"

export const translateText = async (text, to = "am") => {
  try {
    const response = await axios.post(
      `${endpoint}/translate?api-version=3.0&to=${to}`,
      [{ Text: text }],
      {
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Ocp-Apim-Subscription-Region": region,
          "Content-Type": "application/json",
        },
      }
    )

    return response.data[0].translations[0].text
  } catch (err) {
    console.error("Translation error:", err)
    return text
  }
}
