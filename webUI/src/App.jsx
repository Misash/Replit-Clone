import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import IDE from "./components/IDE"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IDE/>}>  </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App;