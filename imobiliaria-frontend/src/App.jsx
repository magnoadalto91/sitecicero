import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Imoveis from "./pages/Imoveis.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Layout from "./components/Layout.jsx";
import DetalheImovel from "./pages/DetalheImovel.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas com Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/imoveis"
          element={
            <Layout>
              <Imoveis />
            </Layout>
          }
        />

        <Route
          path="/imovel/:id"
          element={
            <Layout>
              <DetalheImovel />
            </Layout>
          }
        />

        {/* Login SEM layout */}
        <Route path="/login" element={<Login />} />

        {/* Admin protegido COM layout */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Layout>
                <Admin />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}