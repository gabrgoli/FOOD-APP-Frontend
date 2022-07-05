import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import RecipeCreate from "./components/CreateRecipe";
import Details from "./components/Details";
function App() {
  return (
    //en cada path le digo renderizame este componente
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/recipe/:id" element={<Details />} />
          <Route path="/recipe" element={<RecipeCreate />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;

//

/* 
        <Route path='/home/:id' element={<Details/>}/>
*/
