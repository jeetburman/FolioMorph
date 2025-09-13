import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import FlipBook from "./components/Flipbook";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/HOme";
import NotFound from "./components/NotFound";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}
