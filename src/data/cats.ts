export type Cat = {
  id: string
  role: string
  name: string
  latin: string
  desc: string
  traits: string[]
  caption: string
  date: string
  imageSize: 'portrait_4_3' | 'landscape_4_3' | 'square'
  prompt: string
}

const filmStyle =
  'realistic fur detail, soft film photography, warm cream and peach low-saturation tones, natural window light, shallow depth of field, subtle film grain, cozy Japanese home interior, no text, no watermark'

export const cats: Cat[] = [
  {
    id: 'mochi',
    role: '程序汪',
    name: 'Mochi',
    latin: 'THE CODER',
    desc: '金毛小狗戴着圆眼镜趴在笔记本旁，一杯还冒着热气的咖啡。它不写代码，但每次编译失败都第一个把脑袋搁上键盘。',
    traits: ['金毛混血', '键盘监工', '咖啡搭子'],
    caption: '今天也在等一个不会报错的下午。',
    date: '2026.11.12',
    imageSize: 'portrait_4_3',
    prompt: `a fluffy cream golden retriever puppy wearing round tortoiseshell glasses, lying lazily with chin on paws beside an open laptop on a wooden desk, a cup of latte with soft steam nearby, coding stickers on the laptop, ${filmStyle}`,
  },
  {
    id: 'pudding',
    role: '社交汪',
    name: 'Pudding',
    latin: 'THE GREETER',
    desc: '戴着耳机趴在电脑后面，只露出半张脸。有人靠近就先观察三秒，确认是熟人才探出来打招呼。',
    traits: ['奶白卷毛', '耳机常驻', '只黏熟人'],
    caption: '耳机一戴，谁都不爱；你除外。',
    date: '2026.11.10',
    imageSize: 'landscape_4_3',
    prompt: `a fluffy cream Maltipoo dog with floppy ears sitting behind an open laptop on a wooden desk, oversized headphones around its ears, one front paw raised, peeking over the laptop lid, ${filmStyle}`,
  },
  {
    id: 'latte',
    role: '摸鱼汪',
    name: 'Latte',
    latin: 'THE SLACKER',
    desc: '趴在桌边的软垫上，怀里搂着一个粉色小玩具。它不是不努力，只是把力气都留给了下一局游戏。',
    traits: ['博美', '躺平摸鱼', '玩具不离手'],
    caption: '阳光正好，代码晚点再说。',
    date: '2026.11.08',
    imageSize: 'landscape_4_3',
    prompt: `a fluffy orange pomeranian puppy lying on a soft white mat, hugging a small pink toy with its front paws, relaxed lazy expression, warm indoor light, ${filmStyle}`,
  },
  {
    id: 'biscuit',
    role: '干饭汪',
    name: 'Biscuit',
    latin: 'THE FOODIE',
    desc: '饭点前十分钟就站起来表演「我很乖」，舌头伸得老长，眼神一直黏在你手里的零食上。',
    traits: ['柯基', '站姿讨饭', '准点开饭'],
    caption: '认真吃饭，是一种生活态度。',
    date: '2026.11.06',
    imageSize: 'landscape_4_3',
    prompt: `a cute welsh corgi dog standing on its hind legs on a park path, tongue out with a happy smile, begging for treats, soft green bokeh background, golden hour, ${filmStyle}`,
  },
  {
    id: 'bean',
    role: '充电汪',
    name: 'Bean',
    latin: 'THE RECHARGER',
    desc: '蜷成一团睡在床头灯旁边，呼吸很轻，一只爪子还搭在脸颊上。它说，人和狗一样，都需要定期回血。',
    traits: ['奶油小狗', '团子睡姿', '低电量救星'],
    caption: '先充会儿电，再继续发光。',
    date: '2026.11.04',
    imageSize: 'landscape_4_3',
    prompt: `a tiny fluffy cream pomeranian puppy sleeping curled up on a soft white duvet, one paw tucked against its cheek, eyes gently closed, a warm bedside lamp glowing in the background, cozy bedroom, ${filmStyle}`,
  },
  {
    id: 'pepper',
    role: '巡夜汪',
    name: 'Pepper',
    latin: 'THE NIGHT SHIFT',
    desc: '一双蓝眼睛在屏幕的光里格外亮。它假装自己很会守夜，其实只是在等你伸手摸摸它的头。',
    traits: ['边牧幼犬', '蓝眼睛', '守夜担当'],
    caption: '你负责代码，我负责看夜景。',
    date: '2026.11.02',
    imageSize: 'landscape_4_3',
    prompt: `a border collie puppy sitting on a warm wooden floor, striking bright blue eyes, alert and curious expression, soft morning light, ${filmStyle}`,
  },
  {
    id: 'sesame',
    role: '伴读汪',
    name: 'Sesame',
    latin: 'THE STUDY BUDDY',
    desc: '趴在摊开的论文和草稿上，下巴搁在爪子中间。它看不懂那些公式，但会一直陪到台灯熄掉。',
    traits: ['金毛幼犬', '趴书姿势', '陪读气氛组'],
    caption: '书可以慢慢读，我就在这儿。',
    date: '2026.10.30',
    imageSize: 'landscape_4_3',
    prompt: `a fluffy golden retriever puppy lying on open notebooks and loose papers on a wooden desk, chin resting between its front paws, gentle eyes looking at the camera, warm afternoon window light, ${filmStyle}`,
  },
]

export function catImage(cat: Cat) {
  return `/dogs/${cat.id}.jpg`
}

export const heroCat = cats[0]
