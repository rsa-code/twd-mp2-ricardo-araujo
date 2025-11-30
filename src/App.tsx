import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { JikanEpisodes } from './pages/JikanEpisodes';
import { NanaVolumes } from './pages/NanaVolumes';
import { NanaCharacters } from './pages/NanaCharacters';
import { NanaBands } from './pages/NanaBands';
import { Navbar } from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<NanaCharacters />} />
          <Route path="/bands" element={<NanaBands />} />
          <Route path="/jikan-episodes" element={<JikanEpisodes />} />
          <Route path="/nana-volumes" element={<NanaVolumes />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;