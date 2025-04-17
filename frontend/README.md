// Microsoft Translator + i18next

Sure! Here's a step-by-step guide on how to integrate Microsoft Translator with i18next in a React app to enable dynamic translations (including Amharic) for free\*:

✅ Microsoft Translator supports auto-translation to Amharic and integrates nicely into modern apps. i18next manages your app's multilingual support.

✅ Step-by-Step: Microsoft Translator + i18next in React
⚙️ 1. Create an Azure Account and Translator Resource
Go to https://portal.azure.com

Search for "Translator" in the top search bar.

Click “Create” > fill in:

Subscription: Free or your plan

Resource group: Create or select

Region: Any region (East US is fine)

Pricing Tier: Free F0 (up to 2M characters/month)

Once created, go to Keys and Endpoint tab and copy:

Key 1

Endpoint (URL)

🧠 2. Install Dependencies in Your React App
bash
Copy
Edit
npm install i18next react-i18next axios
🛠️ 3. Create i18n.js Configuration File
Inside src/i18n.js:

js
Copy
Edit
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
fallbackLng: "en",
lng: "en",
resources: {
en: {
translation: {},
},
am: {
translation: {},
},
},
interpolation: {
escapeValue: false,
},
});

export default i18n;
🔠 4. Translator API Function
Create src/utils/translateText.js:

js
Copy
Edit
import axios from "axios";

const key = "YOUR_TRANSLATOR_KEY";
const endpoint = "https://api.cognitive.microsofttranslator.com";
const region = "YOUR_RESOURCE_REGION"; // e.g. "eastus"

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
);

    return response.data[0].translations[0].text;

} catch (err) {
console.error("Translation error:", err);
return text;
}
};
🧩 5. Use It Dynamically with i18next
In your component:

js
Copy
Edit
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateText } from "../utils/translateText";

const JobCard = ({ job }) => {
const { i18n } = useTranslation();
const [translatedDesc, setTranslatedDesc] = useState(job.description);

useEffect(() => {
const doTranslation = async () => {
if (i18n.language !== "en") {
const translated = await translateText(job.description, i18n.language);
setTranslatedDesc(translated);
}
};

    doTranslation();

}, [i18n.language, job.description]);

return (
<div>
<h2>{job.title}</h2>
<p>{translatedDesc}</p>
</div>
);
};
🌍 6. Add a Language Switcher
js
Copy
Edit
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
const { i18n } = useTranslation();

const handleChange = (e) => {
i18n.changeLanguage(e.target.value);
};

return (
<select onChange={handleChange} value={i18n.language}>
<option value="en">English</option>
<option value="am">Amharic</option>
</select>
);
};
✅ Result:
English content is dynamically translated into Amharic (or other languages) using Microsoft Translator.

i18next manages language state.

You don’t need to hardcode translations anymore — it's automatic.

💡 Bonus Tips:
Cache translations to avoid extra API usage.

Use localStorage or a DB to save user language preferences.

Free tier gives 2 million characters/month — pretty generous for most apps.

Want me to help you plug this into your actual codebase or job-related components next?
