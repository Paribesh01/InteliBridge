
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";

function App() {

  return (
    <>
    <BrowserRouter>
    
        <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        </Routes>

    </BrowserRouter>
     
    </>
  )
}

export default App
