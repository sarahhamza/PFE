//import "./list.scss"
import Sidebar from "../../components/sidebar/side"
import Navbar from "../../components/navbar/Navbar"
import { PrimeReactProvider } from "primereact/api"
import Single from './Single';

const SingleDetails = () => {
  return (
    <div className="list">
      <Sidebar/>
      <section className="contents">
        <Navbar/>
        <PrimeReactProvider>
        <Single/>
        </PrimeReactProvider>
        </section>
    </div>
  )
}
export default SingleDetails ;