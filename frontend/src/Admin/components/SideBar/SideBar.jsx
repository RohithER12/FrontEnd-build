import { Link, NavLink } from 'react-router-dom';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent
} from 'react-pro-sidebar';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaTachometerAlt,
  FaUsers
} from 'react-icons/fa';

import {BsFillPersonFill,BsVectorPen,BsExclamationTriangle} from 'react-icons/bs'
import './SideBar.css'
import { useState } from 'react';


const Sidebar = ({
  image,
  collapsed,
  toggled,
  handleToggleSidebar,
  handleCollapsedChange
}) => {
  const [className,setClassName] = useState('')
  return (
    <ProSidebar
      // image={image ? sidebarBg : false}
      collapsed={collapsed}
      toggled={toggled}
      onToggle={handleToggleSidebar}
      breakPoint="md"
      style={{ height: '100vh',backgroundColor:'#03000a'}}
    >
      {/* Header */}
      <SidebarHeader
      style={{ backgroundColor:'#03000a' }}
      >
        <Menu iconShape="circle">
          {collapsed ? (
            <MenuItem
              icon={<FaAngleDoubleRight />}
              onClick={handleCollapsedChange}
            ></MenuItem>
          ) : (
            <MenuItem
              suffix={<FaAngleDoubleLeft />}
              onClick={handleCollapsedChange}
            >
            </MenuItem>
          )}
        </Menu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent
      style={{ backgroundColor:'#03000a' }}
      >
        <Menu iconShape="circle">
          <MenuItem
            icon={<FaTachometerAlt />}
            >
           Dashboard
            <NavLink to="/admin/home" >
            </NavLink>
          </MenuItem>
          <MenuItem icon={<BsFillPersonFill  />}>
           Users <NavLink to="/admin/users" >
            </NavLink>
          </MenuItem>
          <MenuItem icon={<BsVectorPen />}>
           Interests <NavLink to="/admin/interests" />
          </MenuItem>
          <MenuItem icon={< FaUsers />}>
           Communities <NavLink to="/admin/community" />
          </MenuItem>
          <MenuItem icon={< BsExclamationTriangle />}>
           Reports <NavLink to="/admin/report" />
          </MenuItem>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default Sidebar;
