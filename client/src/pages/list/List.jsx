import "./list.scss"
import Sidebar from "../../components/sidebar/side"
import Navbar from "../../components/navbar/Navbar"
//import Datatable from "../../components/datatable/Datatable"
import UserList from "../../components/datatable/UsersList"
import { PrimeReactProvider } from "primereact/api"

const List = () => {

  return (
    <div className="list">
      <Sidebar/>
      <section className="contents">
        <Navbar/>
        <PrimeReactProvider>
        <UserList/>
        </PrimeReactProvider>
        </section>
    </div>
  )
}

export default List