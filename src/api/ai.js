import axios from "axios";
import { useCookies } from "vue3-cookies";
import { GoogleGenerativeAI  } from '@google/generative-ai'

const { cookies } = useCookies();

function getPrompts() {
  const access_token = cookies.get("access_token");

  return axios
    .get("http://localhost:80/ai/prompts")
    .then((response) => {
      console.log(response.data);
      return response.data;
    });
}

async function makeGeminiPlan(prompt) {
    const VITE_GOOGLE_AI_STUDIO_API_KEY = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY

    const genAI = new GoogleGenerativeAI(VITE_GOOGLE_AI_STUDIO_API_KEY)
    const model = await genAI.getGenerativeModel({ model: 'gemini-pro' })

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
}


export { getPrompts, makeGeminiPlan };
