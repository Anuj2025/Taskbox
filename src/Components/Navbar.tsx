import React from 'react'
import {Link} from "react-router-dom"

const Navbar = () => {
  return (
    <header className="z-50 navbar bg-base-100 text-primary-content h-[60px] align-middle text-center w-full fixed top-0 p-[20px] flex justify-between border-[1px] border-neutral-content">
    <div className="font-bold text-neutral-600">
    Skix
    </div>
    <nav>
     <ul className="flex gap-2 justify-between">
     <li><Link className="text-neutral" to="/new">New</Link></li>
     <li><Link className="text-neutral" to="/dashboard">dashboard</Link></li>
      <li><Link className="text-neutral" to="/auth/signup">Account</Link></li>
     </ul>
    </nav>
    </header>
  )
}

export default Navbar