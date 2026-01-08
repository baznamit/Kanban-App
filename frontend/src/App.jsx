import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Deals from "./pages/Deals";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/deals" element={<Deals />} />
      </Routes>
    </BrowserRouter>
  );
}
