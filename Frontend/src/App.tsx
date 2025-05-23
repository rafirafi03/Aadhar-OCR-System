import "./App.css";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <Home />
    </>
  );
}

export default App;
