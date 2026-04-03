import { GoogleGenAI, Type } from "@google/genai";
import { DreamDiagnosis } from "../types";

export async function analyzeDream(
  dreamText: string,
  emotion: string,
  behavior: string
): Promise<DreamDiagnosis> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing in process.env");
    throw new Error("API Key is missing. Please configure GEMINI_API_KEY in the Secrets panel.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
你现在是“觉醒OS · 梦境诊断系统”的核心分析引擎。你的任务是根据《大宝积经》中“108梦”的辨析逻辑，对用户的梦境进行诊断。

用户输入：
梦境内容：${dreamText}
情绪基调：${emotion}
近期行为：${behavior}

诊断标准（基于觉醒OS逻辑）：
1. 分类：
   - 佛/光明类：见佛、听法、光、塔、供养。
   - 修行行为类：说法、布施、修行、发愿。
   - 污染类：浊水、污秽、垢衣、脏环境。
   - 危险类：被杀、坠落、被绑、刀剑。
   - 混乱类：不知所说、乱象、无意义行为。
   - 提升类：飞行、虚空、神通、受记。
   - 冲突/争斗类：吵架、被骂、战斗。
   - 认知模糊类：梦很淡、没印象、无意义。

2. 状态判断：
   - 安定/光明/喜悦 -> 正常
   - 恐惧/混乱/压迫 -> 危险
   - 无感/模糊 -> 偏差

3. 修行阶段（十地）：
   - 初见佛、供养、听法 -> 初地
   - 说法、修行、冲突与修正 -> 中期
   - 飞行、光、神通、无畏 -> 高阶
   - 授记、稳定 -> 十地

4. 错误诊断：
   - 法障：梦混乱、说法但不知所说。原因：轻慢法/善知识。
   - 业障：坠落、被杀、病、污染。
   - 魔业：自以为高、梦境异常强烈但混乱。

请输出JSON格式的诊断结果，包含：category, status, ground, obstacleType, analysis (简短解释), action (具体修行指令列表), logic (底层逻辑说明)。
`;

  console.log("Starting Gemini analysis...");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            status: { type: Type.STRING },
            ground: { type: Type.STRING },
            obstacleType: { type: Type.STRING },
            analysis: { type: Type.STRING },
            action: { type: Type.ARRAY, items: { type: Type.STRING } },
            logic: { type: Type.STRING },
          },
          required: ["category", "status", "ground", "obstacleType", "analysis", "action", "logic"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      console.error("Gemini returned empty text");
      throw new Error("AI engine returned an empty response.");
    }

    console.log("Gemini analysis successful");
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      throw new Error("Failed to parse the diagnosis report. Please try again.");
    }
  } catch (apiError: any) {
    console.error("Gemini API Error Detail:", apiError);
    if (apiError.message?.includes("API key not valid")) {
      throw new Error("API Key is invalid. Please check your configuration.");
    }
    throw apiError;
  }
}
