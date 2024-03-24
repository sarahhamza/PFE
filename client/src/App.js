import Home from "./pages/home/Home";
import Login from "./components/Login";
import Signup from "./components/Singup";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import BasicDemo from "./components/datatable/UsersList";
function App() {
  const { darkMode } = useContext(DarkModeContext);
 // const user = localStorage.getItem("token");

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<List />} />
          <Route path="/products" element={<BasicDemo/>} />
          <Route path="/users/new" element={<New inputs={userInputs} title="Add New User" />} />
          <Route path="/new/product" element={<New inputs={productInputs} title="Add New Product" />} />
          <Route path="/user/:userId" element={<Single />} />
          <Route path="/product/:productId" element={<Single />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
