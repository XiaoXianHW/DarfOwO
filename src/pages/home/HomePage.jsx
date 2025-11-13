import { useRef } from 'react'
import { useConfig } from '../../contexts/ConfigContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ScrollProgress from '../../components/common/ScrollProgress'

const HomePage = () => {
  const config = useConfig()
  const aboutSectionRef = useRef(null)
  
  // 设置页面标题
  usePageTitle('主页')

  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen">
        <HeroSection config={config} onScrollDown={scrollToAbout} />
        <div ref={aboutSectionRef}>
          <AboutSection config={config} />
        </div>
      </div>
    </>
  )
}

export default HomePage
