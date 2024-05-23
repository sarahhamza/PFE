import "./list.scss"
import Sidebar from "../../components/sidebar/side"
import Navbar from "../../components/navbar/Navbar"
//import Datatable from "../../components/datatable/Datatable"
import { PrimeReactProvider } from "primereact/api"
import RoomsTable from "../../components/Rooms/roomsTable"

const UserListRooms = () => {

  return (
    <div className="list">
      <Sidebar/>
      <section className="contents">
        <Navbar/>
        <PrimeReactProvider>
        <RoomsTable/>
        </PrimeReactProvider>
        </section>
    </div>
  )
}

export default UserListRooms ;