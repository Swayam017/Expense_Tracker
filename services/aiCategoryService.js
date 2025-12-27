const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
dotenv.config();
const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

async function getCategoryFromAI(description) {
  const prompt = `
Classify the expense into one of the following categories:
Food, Travel, Shopping, Petrol, Bills, Entertainment, Health, Salary, Other.

Expense: "${description}"

Return ONLY the category name.
`;

    const responsefromAi = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    console.log(responsefromAi.text)

    return  responsefromAi.text ;
}

module.exports = {getCategoryFromAI}