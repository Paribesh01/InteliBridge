
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import Home from "./pages/home";

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
