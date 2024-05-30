//import "./list.scss"
import Sidebar from "../../components/sidebar/side"
import Navbar from "../../components/navbar/Navbar"
import { PrimeReactProvider } from "primereact/api"
import UpdateUser from './Update';

const UpdateData = () => {
  return (
    <div className="list">
      <Sidebar/>
      <section className="contents">
        <Navbar/>
        <PrimeReactProvider>
        <UpdateUser/>
        </PrimeReactProvider>
        </section>
    </div>
  )
}
export default UpdateData;