import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page1 from './Pages/Page1';
import Page2 from './Pages/Page2';

// import dotenv from 'dotenv';
// dotenv.config();

const App = () => {
  return (
    <Router>
    <Routes>
    <Route
      exact
      path="/"
      element={
        <Page1/>
      }
    />
    <Route
      exact
      path="/page2"
      element={
        <Page2/>
      }
    />
    </Routes>
    </Router>
  );
};

export default App;
