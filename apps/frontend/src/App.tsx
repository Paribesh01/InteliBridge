import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import Home from "./pages/home";
import New from "./pages/new";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/new" element={<New />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
