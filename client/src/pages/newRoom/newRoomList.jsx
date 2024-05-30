//import "./list.scss"
import Sidebar from "../../components/sidebar/side"
import Navbar from "../../components/navbar/Navbar"
import { PrimeReactProvider } from "primereact/api"
import NewRoom from './newRoom';

const NewUser = () => {
  return (
    <div className="list">
      <Sidebar/>
      <section className="contents">
        <Navbar/>
        <PrimeReactProvider>
        <NewRoom/>
        </PrimeReactProvider>
        </section>
    </div>
  )
}
export default NewUser;