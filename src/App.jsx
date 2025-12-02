import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './contexts/ThemeContext'
import { ConfigProvider } from './contexts/ConfigContext'
import { BackgroundProvider } from './contexts/BackgroundContext'
import { LayoutProvider } from './contexts/LayoutContext'
import { ArticleSettingsProvider } from './contexts/ArticleSettingsContext'
import Layout from './components/layout/Layout'
import AppRoutes from './routes/AppRoutes'
import CustomCursor from './components/common/CustomCursor'
import ScrollToTop from './components/common/ScrollToTop'

function App() {
  return (
    <HelmetProvider>
      <ConfigProvider>
        <ThemeProvider>
          <BackgroundProvider>
            <LayoutProvider>
              <ArticleSettingsProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <CustomCursor />
                  <Layout>
                    <AppRoutes />
                  </Layout>
                </BrowserRouter>
              </ArticleSettingsProvider>
            </LayoutProvider>
          </BackgroundProvider>
        </ThemeProvider>
      </ConfigProvider>
    </HelmetProvider>
  )
}

export default App
