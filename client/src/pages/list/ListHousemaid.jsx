import "./list.scss"
import Sidebar from "../../components/sidebar/side"
import Navbar from "../../components/navbar/Navbar"
//import Datatable from "../../components/datatable/Datatable"
import { PrimeReactProvider } from "primereact/api"
import HousemaidList from "../../components/datatable/HousemaidList"

const ListHousemaid = () => {
  return (
    <div className="list">
      <Sidebar/>
      <section className="contents">
        <Navbar/>
        <PrimeReactProvider>
        <HousemaidList/>
        </PrimeReactProvider>
        </section>
    </div>
  )
}

export default ListHousemaid