import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './Components/Home.jsx'; // Adjust the path if necessary
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
