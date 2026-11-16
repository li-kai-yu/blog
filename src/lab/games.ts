export type GameId = 'memory' | 'hue' | 'reaction'

export type GameMeta = {
  name: string
  latin: string
  glyph: string
  description: string
  card: string
  hint: string
}

export const GAMES: Record<GameId, GameMeta> = {
  memory: {
    name: '记忆配对',
    latin: 'MEMORY MATCH',
    glyph: '◫',
    description: '翻开两张卡片，找齐 8 对技术符号。用最少的步数完成它。',
    card: '8 对卡片，测试你的短期记忆与一点耐心。',
    hint: '翻牌 → 记住 → 配对',
  },
  hue: {
    name: '色感挑战',
    latin: 'HUE SENSE',
    glyph: '◒',
    description: '在相近的色块中，找出与目标完全一致的那一个。共 8 轮。',
    card: '颜色越接近，越需要相信自己的眼睛。',
    hint: '看起来一样，其实差一点',
  },
  reaction: {
    name: '反应测试',
    latin: 'REACTION TEST',
    glyph: '◎',
    description: '等泡泡变成绿色再点击，测一测你的反应速度。5 轮取平均。',
    card: '别抢跑，也别发呆，绿色出现时点下去。',
    hint: '别抢跑，也别发呆',
  },
}
