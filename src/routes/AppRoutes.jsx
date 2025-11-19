import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/home/HomePage'
import ArticlesPage from '../pages/articles/ArticlesPage'
import ArticleDetailPage from '../pages/articles/ArticleDetailPage'
import ProjectsPage from '../pages/projects/ProjectsPage'
import FriendsPage from '../pages/friends/FriendsPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/*" element={<ArticleDetailPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/friends" element={<FriendsPage />} />
    </Routes>
  )
}

export default AppRoutes
