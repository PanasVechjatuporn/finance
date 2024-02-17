import "App.css";
import { useState, useEffect } from "react";
import firebase from "services/firebase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "pages/dashboard";
import { Home } from "pages/homepage";
import { EditFormPage } from "pages/editpages_form";
import { GoalBased } from "pages/goalbased";
import { NewTaxGoal } from "pages/newtaxgoal";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/edit-form" element={<EditFormPage />} />
        <Route path="/Goal-Based" element={<GoalBased />} />
        <Route path="/Goal-Based/reduce-tax-goal" element={<NewTaxGoal />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
