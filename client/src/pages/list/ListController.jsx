import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
//import Datatable from "../../components/datatable/Datatable"
import { PrimeReactProvider } from "primereact/api"
import ControllerList from "../../components/datatable/ControllerList"

const ListController = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <PrimeReactProvider>
        <ControllerList/>
        </PrimeReactProvider>
      </div>
    </div>
  )
}

export default ListController