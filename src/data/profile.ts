import { site } from './site'

export const facts = [
  { label: '家乡', value: site.location, en: 'LUOYANG' },
  { label: '学校', value: site.school, en: 'HAUST' },
  { label: '专业', value: site.major, en: 'SOFTWARE ENGINEERING' },
  { label: '邮箱', value: site.email, en: 'EMAIL', href: `mailto:${site.email}` },
]

export const skills = [
  { label: 'Java', value: 88 },
  { label: 'Spring Boot / MyBatis-Plus', value: 86 },
  { label: 'MySQL', value: 82 },
  { label: 'Redis', value: 80 },
  { label: 'RabbitMQ / Elasticsearch', value: 72 },
  { label: 'Docker / Git', value: 70 },
]

export const learningPath = [
  'Java SE',
  'MySQL',
  'Java Web',
  'Redis',
  'MukoBazaar',
  'Spring Cloud / MQ / ES',
  'LangChain4j',
]
