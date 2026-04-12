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

4. 错误诊断深度定义：
   - 法障：指在修行中因轻慢佛法、轻慢善知识，或仅停留在文字知见而产生的障碍。表现为梦中说法却不知所云、听法时心生散乱、或梦境极度混乱。
   - 业障：指往昔恶业在现世修行中的显现。表现为梦中坠落、被追杀、身体沉重、疾病、或身处污秽环境。这是身心被负面能量束缚的征兆。
   - 魔业：指修行中产生的微细执着或贡高我慢被外境所乘。表现为梦境异常强烈、自以为获得极高成就、或在梦中产生强烈的贪执与傲慢。

请输出JSON格式的诊断结果，包含：category, status, ground, obstacleType, obstacleDefinition (对识别出的障碍进行深度定义和原理说明), analysis (简短解释), action (具体修行指令列表), logic (底层逻辑说明)。
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
            obstacleDefinition: { type: Type.STRING },
            analysis: { type: Type.STRING },
            action: { type: Type.ARRAY, items: { type: Type.STRING } },
            logic: { type: Type.STRING },
          },
          required: ["category", "status", "ground", "obstacleType", "obstacleDefinition", "analysis", "action", "logic"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      console.error("Gemini returned empty text");
      throw new Error("AI引擎返回了空响应。");
    }

    console.log("Gemini analysis successful");
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      throw new Error("解析诊断报告失败，请重试。");
    }
  } catch (apiError: any) {
    console.error("Gemini API Error Detail:", apiError);
    if (apiError.message?.includes("API key not valid")) {
      throw new Error("API Key 无效，请检查配置。");
    }
    // If it's a 404, it might be the model name.
    if (apiError.status === "NOT_FOUND" || apiError.code === 404) {
      throw new Error("模型未找到或不可用，请稍后重试。");
    }
    throw new Error(`分析失败: ${apiError.message || '未知错误'}`);
  }
}
