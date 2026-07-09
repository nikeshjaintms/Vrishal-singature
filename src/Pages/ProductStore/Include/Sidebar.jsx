import { BadgeIndianRupee, ClipboardCheck, LayoutDashboard, LayoutList, List, Package2, Presentation, UsersRound, Warehouse, } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [storeMenu, setStoreMenu] = useState(false);
  const [transaction, setTransaction] = useState(false);

  const handleTransaction = () => {
    setTransaction(!transaction);
  };

  const handleStore = () => {
    setStoreMenu(!storeMenu);
  };

  useEffect(() => {
    if (
      location.pathname === "/product-store/user/unit-management" ||
      location.pathname === "/product-store/user/manage-unit" ||
      location.pathname === "/product-store/user/category-management" ||
      location.pathname === "/product-store/user/manage-category" ||
      location.pathname === "/product-store/user/transport-management" ||
      location.pathname === "/product-store/user/manage-transport" ||
      location.pathname === "/product-store/user/inventory-location-management" ||
      location.pathname === "/product-store/user/manage-inventory-location" ||
      location.pathname === "/product-store/user/party-group-management" ||
      location.pathname === "/product-store/user/manage-party-group"
    ) {
      setStoreMenu(true);
    }

    if (
      location.pathname === "/product-store/user/purchase-management" ||
      location.pathname === "/product-store/user/purchase-order-management" ||
      location.pathname === "/product-store/user/manage-purchase-order" ||
      location.pathname === '/product-store/user/purchase-return-management' ||

      location.pathname === "/product-store/user/sales-management" ||
      location.pathname === "/product-store/user/sales-order-management" ||
      location.pathname === '/product-store/user/manage-sales-order'
    ) {
      setTransaction(true);
    }
  }, [location.pathname]);

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll side-bar-scroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li>
              <Link
                to="/product-store/user/dashboard"
                className={`${location.pathname === "/product-store/user/dashboard" ? "active" : ""
                  }`}
              >
                <span className="menu-side">
                  <LayoutDashboard className="Dash-iCon" />
                </span>
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to="/product-store/user/project-management"
                className={`${location.pathname === "/product-store/user/project-management" || location.pathname === "/product-store/user/manage-project" ? "active" : ""}`}
              >
                <span className="menu-side">
                  <Presentation className="Dash-iCon" />
                </span>
                <span>Project</span>
              </Link>
            </li>

            <li className="submenu">
              {/* eslint-disable jsx-a11y/anchor-is-valid */}
              <a
                className={`${storeMenu === true ? "subdrop active" : ""}`}
                onClick={handleStore}
                style={{ cursor: "pointer" }}
              >
                <span className="menu-side">
                  <Warehouse className="Dash-iCon" />
                </span>
                <span> Store </span> <span className="menu-arrow" />
              </a>
              <ul style={{ display: storeMenu ? "block" : "none" }}>
                <li>
                  <Link to="/product-store/user/unit-management" className={`${location.pathname === "/product-store/user/unit-management" ||
                    location.pathname === "/product-store/user/manage-unit" ? "active" : ""}`} >
                    Unit
                  </Link>

                  <Link
                    to="/product-store/user/category-management" className={`${location.pathname === "/product-store/user/category-management" ||
                      location.pathname === "/product-store/user/manage-category" ? "active" : ""}`}
                  >
                    Item Category
                  </Link>

                  <Link
                    to="/product-store/user/transport-management"
                    className={`${location.pathname === "/product-store/user/transport-management" ||
                      location.pathname === "/product-store/user/manage-transport" ? "active" : ""}`}
                  >
                    Transport
                  </Link>

                  <Link
                    to="/product-store/user/inventory-location-management" className={`${location.pathname === "/product-store/user/inventory-location-management" || location.pathname === "/product-store/user/manage-inventory-location" ? "active" : ""}`}>
                    Inventory Location
                  </Link>

                  <Link
                    to="/product-store/user/party-group-management"
                    className={`${location.pathname === "/product-store/user/party-group-management" || location.pathname === "/product-store/user/manage-party-group" ? "active" : ""}`}>
                    Party Group
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/product-store/user/party-management"
                className={`${location.pathname === "/product-store/user/party-management" || location.pathname === "/product-store/user/manage-party" ? "active" : ""}`}
              >
                <span className="menu-side">
                  <UsersRound className="Dash-iCon" />
                </span>
                <span>Party</span>
              </Link>
            </li>

            <li>
              <Link
                to="/product-store/user/item-management"
                className={`${location.pathname === "/product-store/user/item-management" || location.pathname === "/product-store/user/manage-item" ? "active" : ""}`}>
                <span className="menu-side">
                  <LayoutList className="Dash-iCon" />
                </span>
                <span>Item</span>
              </Link>
            </li>

            <li className="submenu">
              {/* eslint-disable jsx-a11y/anchor-is-valid */}
              <a
                className={`${transaction === true ? "subdrop active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={handleTransaction}>
                <span className="menu-side">
                  <BadgeIndianRupee className="Dash-iCon" />
                </span>
                <span> Transaction </span> <span className="menu-arrow" />
              </a>
              <ul style={{ display: transaction ? "block" : "none" }}>
                <Link
                  to="/product-store/user/purchase-order-management"
                  className={`${location.pathname === "/product-store/user/purchase-order-management" || location.pathname === '/product-store/user/manage-purchase-order' ? "active" : ""}`}
                >
                  Purchase Order
                </Link>

                <Link to="/product-store/user/sales-order-management" className={`${location.pathname === '/product-store/user/sales-order-management' || location.pathname === '/product-store/user/manage-sales-order' ? 'active' : ''}`} >
                  Sales Order
                </Link>
              </ul>
            </li>

            <li>
              <Link to="/product-store/user/request-management"
                className={`${location.pathname === "/product-store/user/request-management" ? "active" : ""}`}>
                <span className="menu-side">
                  <ClipboardCheck className="Dash-iCon" />
                </span>
                <span>Request</span>
              </Link>
            </li>

            <li>
              <Link to="/product-store/user/item-records-management"
                className={`${location.pathname === "/product-store/user/item-records-management" ? "active" : ""}`}
              >
                <span className="menu-side">
                  <List className="Dash-iCon" />
                </span>
                <span>Item Records</span>
              </Link>
            </li>


            <li>
              <Link
                to="/product-store/user/stock-management"
                className={`${location.pathname === "/product-store/user/stock-management" ||
                  location.pathname === "/product-store/user/manage-stock" ? "active" : ""}`}
              >
                <span className="menu-side">
                  <Package2 className="Dash-iCon" />
                </span>
                <span>Stock</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
