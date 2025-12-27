require('dotenv').config();
const { getCategoryFromAI } = require('./services/aiCategoryService');

async function test() {
    try {
        console.log("--- Starting AI Test ---");
        const result = await getCategoryFromAI("Starbucks coffee");
        console.log("Description: Starbucks coffee");
        console.log("Detected Category:", result);
        console.log("------------------------");
    } catch (err) {
        console.error("Test failed with error:", err.message);
    }
}

test();