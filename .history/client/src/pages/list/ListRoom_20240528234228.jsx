import "./list.scss"
import Sidebar from "../../components/sidebar/side"
import Navbar from "../../components/navbar/Navbar"
import Rooms from "../roomsList/rooms"
import { PrimeReactProvider } from "primereact/api"

const ListRoom = () => {
  return (
    <div className="list">
      <Sidebar/>
      <section className="contents">
        <Navbar/>
        <PrimeReactProvider>
        <Rooms/>
        </PrimeReactProvider>
        </section>
    </div>
  )
}
export default ListRoom;