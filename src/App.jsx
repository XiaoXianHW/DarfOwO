import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './contexts/ThemeContext'
import { ConfigProvider } from './contexts/ConfigContext'
import { BackgroundProvider } from './contexts/BackgroundContext'
import { LayoutProvider } from './contexts/LayoutContext'
import Layout from './components/layout/Layout'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <HelmetProvider>
      <ConfigProvider>
        <ThemeProvider>
          <BackgroundProvider>
            <LayoutProvider>
              <BrowserRouter>
                <Layout>
                  <AppRoutes />
                </Layout>
              </BrowserRouter>
            </LayoutProvider>
          </BackgroundProvider>
        </ThemeProvider>
      </ConfigProvider>
    </HelmetProvider>
  )
}

export default App
