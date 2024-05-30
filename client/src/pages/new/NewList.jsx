//import "./list.scss"
import Sidebar from "../../components/sidebar/side"
import Navbar from "../../components/navbar/Navbar"
import { PrimeReactProvider } from "primereact/api"
import New from './New';

const NewUser = () => {
  return (
    <div className="list">
      <Sidebar/>
      <section className="contents">
        <Navbar/>
        <PrimeReactProvider>
        <New/>
        </PrimeReactProvider>
        </section>
    </div>
  )
}
export default NewUser;