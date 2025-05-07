import { useLanguage } from "@/context/LanaguageContext"
import { motion } from "framer-motion"

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage()

  const handleChangeLanguage = (e) => {
    const { value } = e.target
    setLanguage(value)
  }

  return (
    <div className="flex items-center justify-center h-32 p-4 mb-4 bg-gray-100 rounded-2xl ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-white shadow-lg rounded-xl"
      >
        <label
          htmlFor="language"
          className="block mb-2 text-sm font-semibold text-center text-gray-600"
        >
          Select Language
        </label>

        <motion.select
          id="language"
          name="language"
          whileHover={{ scale: 1.05 }}
          whileFocus={{ scale: 1.05 }}
          onChange={handleChangeLanguage}
          className="w-64 p-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="en">English</option>
          <option value="am">Amharic</option>
        </motion.select>
      </motion.div>
    </div>
  )
}

export default LanguageSelector
