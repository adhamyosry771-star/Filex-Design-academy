import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const refineDesignBrief = async (rawDescription: string, projectType: string): Promise<string> => {
  try {
    const prompt = `
      أنت مساعد تصميم ذكي وخبير في إدارة المشاريع الإبداعية.
      المستخدم يريد تقديم طلب تصميم من نوع: "${projectType}".
      الوصف الأولي الذي قدمه المستخدم هو: "${rawDescription}".

      قم بإعادة صياغة هذا الوصف ليصبح "ملخص تصميم" (Design Brief) احترافي ومفصل.
      - حسن اللغة واجعلها أكثر وضوحاً.
      - اقترح تفاصيل مفقودة قد تكون مهمة لهذا النوع من التصميم (مثل الألوان المقترحة، الجمهور المستهدف، الانطباع المطلوب).
      - قم بتنسيق الرد كنقاط أو فقرات قصيرة.
      - يجب أن يكون الرد باللغة العربية بالكامل.
      - لا تضف مقدمات طويلة، ادخل في الموضوع مباشرة.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "عذراً، لم أتمكن من تحسين الوصف في الوقت الحالي.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("حدث خطأ أثناء الاتصال بالمساعد الذكي.");
  }
};