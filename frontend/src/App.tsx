import './App.css';
import { Navigator } from './layout/Navigator/Navigator';
import { About } from './pages/About/About';
import { Demo } from './pages/Demo/Demo';
import { Feedback } from './pages/Feedback/Feedback';
import { Roadmap } from './pages/Roadmap/Roadmap';
import { Team } from './pages/Team/Team';
import { Welcome } from './pages/Welcome/Welcome';

function App() {
  return (
    <>
      <Navigator />
      <div id='welcome'>
        <Welcome />
      </div>
      <div id='product'>
        <About />
      </div>
      <div id='demo'>
        <Demo />
      </div>
      <div id='team'>
        <Team />
      </div>
      <div id='plans'>
        <Roadmap />
      </div>
      <div id='contacts'>
        <Feedback />
      </div>
    </>
  );
}

export default App;
