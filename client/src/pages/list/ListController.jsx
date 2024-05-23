import "./list.scss"
import Sidebar from "../../components/sidebar/side"
import Navbar from "../../components/navbar/Navbar"
//import Datatable from "../../components/datatable/Datatable"
import { PrimeReactProvider } from "primereact/api"
import ControllerList from "../../components/datatable/ControllerList"

const ListController = () => {
  return (
    <div className="list">
      <Sidebar/>
      <section className="contents">
        <Navbar/>
        <PrimeReactProvider>
        <ControllerList/>
        </PrimeReactProvider>
        </section>
      </div>
  )
}

export default ListController