export const site = {
  name: 'Elio Li',
  latin: 'ELIO LI · SOFTWARE',
  role: 'Java 后端开发',
  tagline: '把复杂留给系统，把温柔留给体验。',
  description:
    'Elio Li 的个人博客：Java 后端、分布式系统、项目实践、狗狗日常，以及一些关于交互与好奇心的小实验。',
  email: '3183477872@qq.com',
  location: '洛阳',
  school: '河南科技大学',
  major: '软件工程',
  grade: '大二上在读',
  period: '2025.09 – 2029.06',
  github: '',
}

export const navItems = [
  { to: '/', label: '首页', index: '01' },
  { to: '/writing', label: '博客', index: '02' },
  { to: '/moments', label: '动态', index: '03' },
  { to: '/about', label: '关于', index: '04' },
]

export const moreItems = [
  { to: '/projects', label: '项目', en: 'PROJECTS', index: '05' },
  { to: '/interview', label: '八股', en: 'INTERVIEW', index: '06' },
  { to: '/lab', label: '实验室', en: 'LAB', index: '07' },
]

export const allNavItems = [...navItems, ...moreItems]
