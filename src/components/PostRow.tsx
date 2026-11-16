import { Link } from 'react-router-dom'
import { formatDate, type Post } from '../lib/posts'
import { ArrowUpRight } from './Icons'

type PostRowProps = {
  post: Post
  index?: string
}

export default function PostRow({ post, index }: PostRowProps) {
  return (
    <Link to={`/writing/${post.slug}`} className="post-row">
      {index ? <span className="post-row__index">{index}</span> : null}
      <span className="post-row__body">
        <span className="post-row__title">{post.title}</span>
        <span className="post-row__desc">{post.description}</span>
        <span className="post-row__tags">
          {post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          <span>{post.readingMinutes} 分钟阅读</span>
        </span>
      </span>
      <span className="post-row__meta">
        <span className="post-row__date">{formatDate(post.date)}</span>
        <span className="post-row__arrow">
          <ArrowUpRight />
        </span>
      </span>
    </Link>
  )
}
