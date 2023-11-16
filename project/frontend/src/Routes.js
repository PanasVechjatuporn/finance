import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Dashboard  } from "./pages/dashboard"
export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/Dashboard" exact>
                    <Dashboard/>
                </Route>
            </Routes>
        </Router>
    )
}