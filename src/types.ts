export type Theme = 'platinum' | 'forest' | 'amber' | 'azure';

export interface DreamDiagnosis {
  category: "佛/光明类" | "修行行为类" | "污染类" | "危险类" | "混乱类" | "提升类" | "冲突/争斗类" | "认知模糊类";
  status: "正常" | "偏差" | "危险";
  ground: "初地 (入门)" | "中期 (2-6地)" | "高阶 (7-9地)" | "十地";
  obstacleType: "法障" | "业障" | "魔业" | "无" | "精进不足";
  obstacleDefinition: string;
  analysis: string;
  action: string[];
  logic: string;
}

export interface HistoryItem extends DreamDiagnosis {
  date: string;
  text: string;
}
