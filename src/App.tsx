import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AgenteInteligente from './AgenteInteligente';
import Game from './Game';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/agente-inteligente" element={<AgenteInteligente />} />
          <Route path="/" element={<Game />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;