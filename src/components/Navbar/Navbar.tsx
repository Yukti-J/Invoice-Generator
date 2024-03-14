import logo from '../../assets/logo.png'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className="navbar">
        <div className="title2">Invoice Generator</div>
        <div className="logo">
            <img src={logo} className='logoImage'/>
            <div className="title">
                <h4>levitation</h4>
                <p>infotech</p>
            </div>
        </div>
    </div>
  )
}

export default Navbar
