import { useEffect, useState } from 'react'
import Phaser from 'phaser'
import gameConfig from './game/config.js'
import './App.css'

const SECTION_CONTENT = {
  about: { title: 'ABOUT ME', description: 'A little about the adventurer behind this portfolio.' },
  projects: { title: 'PROJECTS', description: 'Explore the projects collected in this realm.' },
  skills: { title: 'SKILLS', description: 'A growing collection of tools, techniques, and things I enjoy building with.' },
  contact: { title: 'CONTACT', description: 'Thanks for stopping by. Get in touch to start a conversation.' },
}

function App() {
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    const game = new Phaser.Game(gameConfig)
    const handleOpen = ({ section }) => setActiveSection(section)
    game.events.on('portfolio:open', handleOpen)

    return () => {
      game.events.off('portfolio:open', handleOpen)
      game.destroy(true)
    }
  }, [])

  const content = activeSection ? SECTION_CONTENT[activeSection] : null

  return (
    <main className="portfolio-app">
      <div id="phaser-game" aria-label="Interactive portfolio game world" />
      {content && (
        <div className="portfolio-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setActiveSection(null)
        }}>
          <section className="portfolio-card" role="dialog" aria-modal="true" aria-labelledby="portfolio-title">
            <button className="portfolio-close" type="button" onClick={() => setActiveSection(null)} aria-label="Close">
              ×
            </button>
            <p className="portfolio-eyebrow">REALM DISCOVERED</p>
            <h1 id="portfolio-title">{content.title}</h1>
            <p>{content.description}</p>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
