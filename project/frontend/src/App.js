import "App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "pages/Dashboard";
import { Home } from "pages/HomePage";
import { GoalBased } from "pages/GoalBased";
import { NewTaxGoal } from "pages/NewTaxGoal";
import { useDispatch, useSelector } from "react-redux";
import { LoginWithLocalData } from "./store/UserSlice";
import { SelectFund } from "pages/SelectFund";
import axios from "axios";
import { NormalGoal } from "pages/NormalGoal";
import { RiskEvalNormalPage } from "pages/RiskEvalNormal";
import { TaxCal } from "pages/TaxCalcuation";

const baseURL = "http://localhost:8000";
function RequireAuth({ children, redirectTo }) {
  const localUser = JSON.parse(localStorage.getItem("userData"));
  if (!localUser) {
    alert("Please Login");
    return <Navigate to={redirectTo} />;
  }
  return localUser.isLogIn ? children : <Navigate to={redirectTo} />;
}
function App() {
  const userStore = useSelector((state) => state.userStore);
  const dispatch = useDispatch();

  try {
    if (userStore.userId === null) {
      const localUser = localStorage.getItem("userData");
      if (localUser) {
        axios
          .post(`${baseURL}/auth/veriylocaluser`, {
            localUser: localUser,
          })
          .then((res) => {
            dispatch(LoginWithLocalData(JSON.parse(localUser)));
          })
          .catch((e) => {
            localStorage.removeItem("userData");
            console.log(e);
          });
      }
    }
  } catch (e) {
    console.log(e);
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={<RequireAuth redirectTo="/">{<Dashboard />}</RequireAuth>}
        />
        <Route
          path="/Goal-Based"
          element={<RequireAuth redirectTo="/">{<GoalBased />}</RequireAuth>}
        />
        <Route path="/Goal-Based/reduce-tax-goal" element={<NewTaxGoal />} />
        <Route
          path="/Goal-Based/risk-evaluation-normal"
          element={
            <RequireAuth redirectTo="/">
              {
                <RiskEvalNormalPage
                />
              }
            </RequireAuth>
          }
        />
        <Route
          path="/Goal-Based/normal-goal"
          element={
            <RequireAuth redirectTo="/">
              <NormalGoal />
            </RequireAuth>
          }
        />
        <Route
          path="/Goal-Based/reduce-tax-goal/select-fund"
          element={<SelectFund />}
        />
        <Route
          path="/tax-calculation"
          element={<RequireAuth redirectTo="/">{<TaxCal />}</RequireAuth>}
        />
        <Route path="/Goal-Based/edit-normal-goal/:goalObjId" element={<NormalGoal />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
