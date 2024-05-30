import "./list.scss"
import Sidebar from "../../components/sidebar/side"
import navbarController from "../../components/navbar/Navbar"

import { PrimeReactProvider } from "primereact/api"
import ControllerRooms from "../ControllerRooms/ControllerRooms"

const ListControllerRooms = () => {
  return (
    <div className="list">
      <Sidebar/>
      <section className="contents">
        <navbarController/>
        <PrimeReactProvider>
        <ControllerRooms/>
        </PrimeReactProvider>
        </section>
    </div>
  )
}
export default ListControllerRooms;