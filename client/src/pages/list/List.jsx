import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
//import Datatable from "../../components/datatable/Datatable"
import UserList from "../../components/datatable/UsersList"
import { PrimeReactProvider } from "primereact/api"

const List = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <PrimeReactProvider>
        <UserList/>
        </PrimeReactProvider>
      </div>
    </div>
  )
}

export default List