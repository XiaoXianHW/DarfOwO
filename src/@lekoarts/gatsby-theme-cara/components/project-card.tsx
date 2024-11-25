/** @jsx jsx */
import { jsx } from "theme-ui"

type ProjectCardProps = {
  link: string
  title: string
  children: React.ReactNode
  bg: string
  tags?: string[]
}

const ProjectCard = ({ link, title, children, bg, tags }: ProjectCardProps) => (
  <a
    href={link}
    target="_blank"
    rel="noreferrer noopener"
    sx={{
      width: `100%`,
      boxShadow: `lg`,
      position: `relative`,
      textDecoration: `none`,
      borderRadius: `lg`,
      px: 4,
      py: 4,
      color: `white`,
      background: bg || `linear-gradient(135deg, #6e7dff, #5a67d8)`,
      transition: `all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important`,
      "&:hover": {
        background: `linear-gradient(135deg, #5a67d8, #6e7dff)`,
        color: `white !important`,
        transform: `translateY(-8px)`,
        boxShadow: `xl`,
      },
    }}
  >
    <div
      sx={{
        pt: 2,
        fontSize: [3, 4, 5],
        fontWeight: `bold`,
        lineHeight: 1.125,
      }}
    >
      {title}
    </div>
    {tags && (
      <div
        sx={{
          mt: 3,
          pt: 2,
          display: `flex`,
          flexWrap: `wrap`,
          gap: `8px`,
        }}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            sx={{
              backgroundColor: `rgba(255, 255, 255, 0.2)`,
              color: `white`,
              fontSize: `0.75rem`,
              fontWeight: `semibold`,
              borderRadius: `6px`,
              px: 2,
              py: 1,
              textTransform: `capitalize`,
              whiteSpace: `nowrap`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    )}
    <div
      sx={{
        opacity: 0.85,
        pt:3,
        textShadow: `0 2px 15px rgba(0, 0, 0, 0.6)`,
        p: {
          fontSize: [1, 2],
          color: `white`,
          margin: 0,
          lineHeight: 1.25,
        },
      }}
    >
      {children}
    </div>
  </a>
)

export default ProjectCard
