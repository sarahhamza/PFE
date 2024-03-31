import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Rooms from "../roomsList/rooms"
import { PrimeReactProvider } from "primereact/api"

const ListRoom = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <PrimeReactProvider>
        <Rooms/>
        </PrimeReactProvider>
      </div>
    </div>
  )
}

export default ListRoom;