import "App.css";
import { useState, useEffect } from "react";
import firebase from "services/firebase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "pages/dashboard";
import { Home } from "pages/homepage";
import { EditFormPage } from "pages/editpages_form";
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/edit-form" element={<EditFormPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
