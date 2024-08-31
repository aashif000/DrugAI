// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyBwAG5o776jvIXp1HMU3h94oaYDW16vmTk");
import { GoogleGenerativeAI } from '@google/generative-ai';
 
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const prompt = "Write a story about a magic backpack.";

try {
  const result = await model.generateContent(prompt);
  console.log('Response:', result.response.text());
} catch (error) {
  console.error('Error:', error);
}
