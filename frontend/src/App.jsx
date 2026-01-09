import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Deals from "./pages/Deals";
import Memo from "./pages/Memo";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/deals/:dealId/memo" element={<Memo />} />
      </Routes>
    </BrowserRouter>
  );
}
