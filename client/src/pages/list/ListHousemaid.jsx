import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
//import Datatable from "../../components/datatable/Datatable"
import { PrimeReactProvider } from "primereact/api"
import HousemaidList from "../../components/datatable/HousemaidList"

const ListHousemaid = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <PrimeReactProvider>
        <HousemaidList/>
        </PrimeReactProvider>
      </div>
    </div>
  )
}

export default ListHousemaid