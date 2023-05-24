import { useState } from "react"

import Category from "./components/Category"
import Products from "./components/Products"
import Pos from "./components/Pos"
import Report from "./components/Report"

const Dashboard = () =>{
  const [viewnumber, setViewnumber] = useState(1)
    return(
        <div className=" d-flex flex-row">
          {/* left side section */}
          <div className='d-flex flex-column bg-danger' style={{width:'175px', height:'87vh'}}>
          <ul className='dlist'>
            <li onClick={() =>setViewnumber(1)}>POS</li>
            <hr/>
            <li onClick={() =>setViewnumber(2)}>Products</li>
            <hr/>
            <li onClick={() =>setViewnumber(3)}>Categories</li>
            <hr/>
            <li onClick={() =>setViewnumber(4)}>Report</li>
            <hr/>
            <li onClick={() =>localStorage.removeItem('profile')}><button className="btn btn-primary">Logout</button></li>
          </ul>
         </div>
          {/* right side section of Dashboard */}
         <div className="m-2" style={{width:'88vw', height:'85vh'}}>
           {viewnumber === 1 && <Pos />}
           {viewnumber === 2 && <Products />}
           {viewnumber === 3 && <Category />}
           {viewnumber === 4 && <Report />}
         </div>
        </div>
    )
}

export default Dashboard