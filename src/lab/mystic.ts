export type MysticId = 'zodiac' | 'almanac' | 'divination' | 'tarot'

export type MysticMeta = {
  name: string
  latin: string
  glyph: string
  hint: string
}

export const MYSTICS: Record<MysticId, MysticMeta> = {
  zodiac: {
    name: '星座运势',
    latin: 'DAILY ZODIAC',
    glyph: '✦',
    hint: '选一个星座，看看今天的心情天气预报。',
  },
  almanac: {
    name: '良辰吉日',
    latin: 'LUCKY ALMANAC',
    glyph: '☼',
    hint: '挑一天，再挑一个吉时。',
  },
  divination: {
    name: '摇一卦',
    latin: 'I CHING',
    glyph: '☯',
    hint: '静心三秒，再摇一卦。',
  },
  tarot: {
    name: '塔罗占卜',
    latin: 'TAROT SPREAD',
    glyph: '✧',
    hint: '翻开过去、现在与未来。',
  },
}

export type Zodiac = {
  name: string
  latin: string
  glyph: string
  element: '火象' | '土象' | '风象' | '水象'
  range: string
}

export const ZODIACS: Zodiac[] = [
  { name: '白羊座', latin: 'ARIES', glyph: '♈', element: '火象', range: '03.21 – 04.19' },
  { name: '金牛座', latin: 'TAURUS', glyph: '♉', element: '土象', range: '04.20 – 05.20' },
  { name: '双子座', latin: 'GEMINI', glyph: '♊', element: '风象', range: '05.21 – 06.21' },
  { name: '巨蟹座', latin: 'CANCER', glyph: '♋', element: '水象', range: '06.22 – 07.22' },
  { name: '狮子座', latin: 'LEO', glyph: '♌', element: '火象', range: '07.23 – 08.22' },
  { name: '处女座', latin: 'VIRGO', glyph: '♍', element: '土象', range: '08.23 – 09.22' },
  { name: '天秤座', latin: 'LIBRA', glyph: '♎', element: '风象', range: '09.23 – 10.23' },
  { name: '天蝎座', latin: 'SCORPIO', glyph: '♏', element: '水象', range: '10.24 – 11.22' },
  { name: '射手座', latin: 'SAGITTARIUS', glyph: '♐', element: '火象', range: '11.23 – 12.21' },
  { name: '摩羯座', latin: 'CAPRICORN', glyph: '♑', element: '土象', range: '12.22 – 01.19' },
  { name: '水瓶座', latin: 'AQUARIUS', glyph: '♒', element: '风象', range: '01.20 – 02.18' },
  { name: '双鱼座', latin: 'PISCES', glyph: '♓', element: '水象', range: '02.19 – 03.20' },
]

export const MOODS = ['顺手', '慢热', '清醒', '柔软', '专注', '松弛', '想摸鱼']

export const ZODIAC_LINES = [
  '今天的你适合先做最难的那件事，剩下的会自己变简单。',
  '有个小问题会反复出现，别急着推翻重来，先把它写下来。',
  '会收到一句迟到的肯定，记得收下，不要急着说“没有啦”。',
  '灵感出现在走路和洗澡的时候，不在工位上。',
  '今天适合少解释一点，把时间留给真正重要的人。',
  '有个旧念头会回来找你，这次可以认真听完。',
  '你的节奏比周围慢半拍，但这半拍刚好让你看清全貌。',
  '适合整理桌面、关掉几个标签页，也整理一下心情。',
]

export const LUCKY_COLORS = [
  { name: '焦糖棕', hex: '#b9805c' },
  { name: '奶油白', hex: '#f1e5d4' },
  { name: '雾霾蓝', hex: '#8fa9b5' },
  { name: '鼠尾草绿', hex: '#a3b39a' },
  { name: '蜜桃粉', hex: '#e7bca9' },
  { name: '燕麦灰', hex: '#c9beae' },
]

export const ALMANAC_YI = [
  '写代码',
  '重构',
  '读文档',
  '复盘',
  '早睡',
  '运动',
  '整理桌面',
  '向喜欢的人打招呼',
  '发版',
  '学新东西',
  '喝一杯热的',
  '开一个新分支',
]

export const ALMANAC_JI = [
  '熬夜',
  '临时改需求',
  '强行联调',
  '乱动线上',
  '空腹喝咖啡',
  '和产品争论',
  '删除分支',
  '刷短视频到两点',
]

export const ALMANAC_HOURS = [
  { name: '辰时', range: '07:00 – 09:00', note: '适合读文档、列今日计划' },
  { name: '巳时', range: '09:00 – 11:00', note: '适合处理最难的那段逻辑' },
  { name: '午时', range: '11:00 – 13:00', note: '适合吃饭、晒太阳、聊聊天' },
  { name: '申时', range: '15:00 – 17:00', note: '适合联调、写测试、收拾尾巴' },
  { name: '亥时', range: '21:00 – 23:00', note: '适合复盘和轻量阅读' },
]

export type Hexagram = {
  name: string
  symbol: string
  lines: number[]
  judgement: string
  reading: string
}

export const HEXAGRAMS: Hexagram[] = [
  {
    name: '乾',
    symbol: '䷀',
    lines: [1, 1, 1, 1, 1, 1],
    judgement: '元亨利贞。',
    reading: '今天适合主动出击。把最难的那个 bug 拎出来，先动第一行代码，气势会自己跟上来。',
  },
  {
    name: '坤',
    symbol: '䷁',
    lines: [0, 0, 0, 0, 0, 0],
    judgement: '地势坤，君子以厚德载物。',
    reading: '适合接住别人的需求，先听完再动手。今天的力量不在冲锋，在把细节稳稳接住。',
  },
  {
    name: '屯',
    symbol: '䷂',
    lines: [1, 0, 0, 0, 1, 0],
    judgement: '元亨利贞，勿用有攸往。',
    reading: '开局有点乱，先别急着重构世界。把环境跑通、把日志打开，答案会自己露头。',
  },
  {
    name: '蒙',
    symbol: '䷃',
    lines: [0, 1, 0, 0, 0, 1],
    judgement: '匪我求童蒙，童蒙求我。',
    reading: '不确定就去问，别靠猜。今天的一次提问，可能省下你三个小时的试错。',
  },
  {
    name: '需',
    symbol: '䷄',
    lines: [1, 1, 1, 0, 1, 0],
    judgement: '有孚，光亨，贞吉。',
    reading: '等待不是停滞，是让环境追上你。代码编译的时候，去接杯水，别盯着进度条。',
  },
  {
    name: '讼',
    symbol: '䷅',
    lines: [0, 1, 0, 1, 1, 1],
    judgement: '有孚窒惕，中吉，终凶。',
    reading: '今天少争论，代码会替你说话。赢了嘴仗不算赢，把测试跑绿才算。',
  },
  {
    name: '师',
    symbol: '䷆',
    lines: [0, 1, 0, 0, 0, 0],
    judgement: '贞，丈人吉，无咎。',
    reading: '适合组队，别一个人扛。把问题拆开交出去，信任队友也是今天的一门功课。',
  },
  {
    name: '比',
    symbol: '䷇',
    lines: [0, 0, 0, 0, 1, 0],
    judgement: '吉。原筮元永贞，无咎。',
    reading: '找一个信任的人对齐，比闷头写更快。今天适合靠近让你觉得舒服的人和事。',
  },
]

export const MOVING_LINES = [
  '动爻在初爻：从最小的一步开始，别一上来就改架构。',
  '动爻在二爻：找到自己的节奏，不必跟着别人的速度跑。',
  '动爻在三爻：注意过度用力，今天适合留一点余地。',
  '动爻在四爻：该沟通了，把憋着的话说清楚。',
  '动爻在五爻：答案已经很近，再耐心一点。',
  '动爻在上爻：见好就收，别把小事拖成大事。',
]

export type TarotCard = {
  name: string
  latin: string
  roman: string
  glyph: string
  keywords: string[]
  upright: string
  reversed: string
  dev: string
}

export const TAROT_CARDS: TarotCard[] = [
  {
    name: '愚者',
    latin: 'THE FOOL',
    roman: '0',
    glyph: '✦',
    keywords: ['开始', '自由', '冒险'],
    upright: '一个新的开始正在招手，先迈出半步，路会在脚下长出来。',
    reversed: '想得太多反而走不动，今天允许自己做一个不完美的小决定。',
    dev: '先写一个能跑的版本，再讨论最佳实践。',
  },
  {
    name: '魔术师',
    latin: 'THE MAGICIAN',
    roman: 'I',
    glyph: '✧',
    keywords: ['创造', '专注', '行动'],
    upright: '工具都在你手里，缺的只是开始。把想法变成第一行代码。',
    reversed: '注意力被切得太碎，关掉几个标签页，先只做一件事。',
    dev: '你需要的依赖早就装好了，别再找新的轮子。',
  },
  {
    name: '女祭司',
    latin: 'THE HIGH PRIESTESS',
    roman: 'II',
    glyph: '☾',
    keywords: ['直觉', '沉静', '观察'],
    upright: '先别急着下结论，安静地看一会儿日志，答案在细节里。',
    reversed: '你在忽略一个早就知道的信号，今晚适合早点睡，明天再决定。',
    dev: '读代码比改代码更重要，先理解它为什么这样写。',
  },
  {
    name: '恋人',
    latin: 'THE LOVERS',
    roman: 'VI',
    glyph: '♡',
    keywords: ['选择', '连接', '坦诚'],
    upright: '今天适合做选择，也适合把真实想法告诉在意的人。',
    reversed: '犹豫会消耗更多能量，选一个方向，哪怕先走一小段。',
    dev: '与其纠结两个方案，不如先写个原型对比一下。',
  },
  {
    name: '战车',
    latin: 'THE CHARIOT',
    roman: 'VII',
    glyph: '➹',
    keywords: ['推进', '意志', '节奏'],
    upright: '保持方向感，今天的你适合一鼓作气把主线推完。',
    reversed: '用力过猛容易偏航，减速不等于失败，先稳住方向盘。',
    dev: '别同时开五个分支，今天只推进一个。',
  },
  {
    name: '力量',
    latin: 'STRENGTH',
    roman: 'VIII',
    glyph: '∞',
    keywords: ['耐心', '温柔', '坚持'],
    upright: '真正的力量是稳稳地坚持，不必和谁比速度。',
    reversed: '对自己太苛刻了，今天先把“必须做好”换成“先做完”。',
    dev: '一个难缠的 bug，往往败在你多试了一次。',
  },
  {
    name: '隐者',
    latin: 'THE HERMIT',
    roman: 'IX',
    glyph: '⌁',
    keywords: ['独处', '内省', '寻找'],
    upright: '给自己留一段安静的时间，答案会在不被打扰的时候出现。',
    reversed: '独处太久会钻牛角尖，今天适合找个人聊两句。',
    dev: '关掉通知，给自己一个完整的 45 分钟。',
  },
  {
    name: '命运之轮',
    latin: 'WHEEL OF FORTUNE',
    roman: 'X',
    glyph: '◎',
    keywords: ['变化', '时机', '循环'],
    upright: '局面正在转动，顺势而为比硬扛更省力。',
    reversed: '计划被打乱不一定是坏事，先看看新的可能性。',
    dev: '今天的随机 bug 可能在提醒你：这里值得补一个测试。',
  },
  {
    name: '星星',
    latin: 'THE STAR',
    roman: 'XVII',
    glyph: '✶',
    keywords: ['希望', '疗愈', '灵感'],
    upright: '一切正在慢慢变好，今天适合做一点让自己开心的小事。',
    reversed: '别因为暂时看不见结果就否定自己，光还在，只是有点远。',
    dev: '那个你一直想做的 side project，今天可以写下第一行。',
  },
  {
    name: '太阳',
    latin: 'THE SUN',
    roman: 'XIX',
    glyph: '☀',
    keywords: ['明亮', '完成', '自信'],
    upright: '今天的能量很亮，适合收尾、发版、把好消息告诉别人。',
    reversed: '别把开心推迟到“全部做完以后”，现在就可以庆祝一点小进度。',
    dev: '跑通的这一刻，值得站起来伸个懒腰。',
  },
]

export function hashString(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

export function pickIndex(seed: number, length: number, salt = 0) {
  if (length <= 0) return 0
  return Math.abs(Math.imul(seed + salt * 977, 2654435761)) % length
}

export function pickUnique<T>(list: T[], count: number, seed: number) {
  const pool = [...list]
  const picked: T[] = []
  for (let index = 0; index < count && pool.length > 0; index += 1) {
    const nextIndex = pickIndex(seed, pool.length, index)
    picked.push(pool[nextIndex])
    pool.splice(nextIndex, 1)
  }
  return picked
}

export function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function todayZodiacIndex() {
  const now = new Date()
  const md = (now.getMonth() + 1) * 100 + now.getDate()
  if (md >= 321 && md <= 419) return 0
  if (md >= 420 && md <= 520) return 1
  if (md >= 521 && md <= 621) return 2
  if (md >= 622 && md <= 722) return 3
  if (md >= 723 && md <= 822) return 4
  if (md >= 823 && md <= 922) return 5
  if (md >= 923 && md <= 1023) return 6
  if (md >= 1024 && md <= 1122) return 7
  if (md >= 1123 && md <= 1221) return 8
  if (md >= 1222 || md <= 119) return 9
  if (md >= 120 && md <= 218) return 10
  return 11
}
