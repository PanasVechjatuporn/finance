import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "pages/Dashboard";
export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Dashboard" exact>
          <Dashboard />
        </Route>
      </Routes>
    </Router>
  );
};
