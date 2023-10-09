import {Navbar, NavbarBrand, NavbarContent, NavbarItem,} from "@nextui-org/react";
import LoginModal from "../../pages/LoginModal/LoginModal";
import SignupModal from "../../pages/SignupModal/SignupModal";
import "./Navbar.css"

export default function Header(){
  return (
    <div>
      <Navbar >
      <NavbarBrand > 
      <p className="font-bold text-inherit"  style={{ color: "#01c8ef" }}>REAN C</p>
      <img src="https://res.cloudinary.com/dcv6mx1nk/image/upload/v1696310324/profile/goccrwzn0ylnttqnmcnb.png" alt="connect" width="12.5" height="15" />
      <p className="font-bold text-inherit" style={{ color: "#01c8ef" }}>NNECT</p>
      </NavbarBrand>
      <NavbarContent justify="end" >
        <NavbarItem >
            <LoginModal />
        </NavbarItem>
        <NavbarItem>
            <SignupModal/>
        </NavbarItem>
      </NavbarContent>
    </Navbar>  
    </div>
  );
}
