import "./App.css";
import Login from "./pages/LoginPage/LoginPage";

import MapUploader from "./pages/MapUpload/MapUploader";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignupPage/SignUpPage";
import RequireAuth from "./routing/RequireAuth";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<RequireAuth />}>
          <Route path="/home" element={<MapUploader />} />
        </Route>
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
