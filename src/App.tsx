import { Outlet } from "react-router-dom"
import Navbar from "./Site/Components/Navbar"
import Footer from "./Site/Components/Footer"

function App() {

  return (
    <div className="base">

      <Navbar />
      <Outlet />
      <Footer />
      
    </div>
  )
}

export default App
