import { BadgeIndianRupee, FileText, LayoutDashboard, LayoutList, Package2, UsersRound, Warehouse, } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [storeMenu, setStoreMenu] = useState(false);
  const [transaction, setTransaction] = useState(false);
  const [report, setReport] = useState(false);
  const [stock, setStock] = useState(false);

  const handleTransaction = () => {
    setTransaction(!transaction);
  };

    const handleStock = () => {
    setStock(!stock);
  };

  const handleReport = () => {
    setReport(!report);
  };

  const handleStore = () => {
    setStoreMenu(!storeMenu);
  };

  useEffect(() => {
    if (
      location.pathname === "/main-store/user/unit-management" ||
      location.pathname === "/main-store/user/manage-unit" ||
      location.pathname === "/main-store/user/category-management" ||
      location.pathname === "/main-store/user/manage-category" ||
      location.pathname === "/main-store/user/transport-management" ||
      location.pathname === "/main-store/user/manage-transport" ||
      location.pathname === "/main-store/user/inventory-location-management" ||
      location.pathname === "/main-store/user/manage-inventory-location" ||
      location.pathname === "/main-store/user/party-group-management" ||
      location.pathname === "/main-store/user/manage-party-group" ||
      location.pathname === '/main-store/user/general-master-management' ||
      location.pathname === '/main-store/user/manage-general-master' ||
      location.pathname === '/main-store/user/unit-location-management' ||
      location.pathname === '/main-store/user/manage-unit-location'
    ) {
      setStoreMenu(true);
    }

    if (
      location.pathname === "/main-store/user/manage-purchase-request" ||
      location.pathname === "/main-store/user/edit-purchase-request-manage" ||
      location.pathname === "/main-store/user/view-purchase-request" ||
      location.pathname === "/main-store/user/getPurchaseRequest" ||
      location.pathname === "/main-store/user/purchase-order-management" ||
      location.pathname === "/main-store/user/manage-purchase-order" ||
      location.pathname === '/main-store/user/view-purchase-order' ||
      location.pathname === '/main-store/user/purchase-order-manage' ||
      location.pathname === '/main-store/user/purchase-return-management' ||
      location.pathname === '/main-store/user/manage-purchase-return' ||
      location.pathname === '/main-store/user/view-purchase-return' ||
      location.pathname === '/main-store/user/return-order-manage' ||

      location.pathname === '/main-store/user/order-management' ||
      location.pathname === '/main-store/user/manage-order' ||
      location.pathname === '/main-store/user/view-order' ||
      location.pathname === '/main-store/user/order-manage' ||

      location.pathname === '/main-store/user/recieving-management' ||
      location.pathname === '/main-store/user/manage-recieving' ||
      location.pathname === '/main-store/user/view-recieving' ||
      location.pathname === '/main-store/user/recieving-manage' ||

      location.pathname === '/main-store/user/issue-purchase-management' ||
      location.pathname === '/main-store/user/view-issue' ||
      location.pathname === '/main-store/user/edit-issue-manage' ||
      location.pathname === '/main-store/user/view-issue-return' ||
      location.pathname === '/main-store/user/manage-purchase-issue' ||
      location.pathname === '/main-store/user/issue-purchase-return-management' ||
      location.pathname === '/main-store/user/manage-purchase-issue-return' ||
      location.pathname === '/main-store/user/manage-purchase-item-return' ||
      location.pathname === '/main-store/user/edit-issue-return-manage' ||
      location.pathname === '/main-store/user/manage-pr'
    ) {
      setTransaction(true);
    }

    if (location.pathname === '/main-store/user/purchase-summary' ||
      location.pathname === '/main-store/user/purchase-return-summary' ||
      location.pathname === '/main-store/user/issue-summary' ||
      location.pathname === '/main-store/user/issue-return-summary' ||
      location.pathname === '/main-store/user/item-ledger' ||
      location.pathname === '/main-store/user/reorder-items'
    ) {
      setReport(true);
    }


      if (location.pathname === '/main-store/user/stock-management' ||
      location.pathname === '/main-store/user/manage-stock' ||
      location.pathname === '/main-store/user/transfer-stock'
    ) {
      setStock(true);
    }
  }, [location.pathname]);

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll side-bar-scroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li>
              <Link
                to="/main-store/user/dashboard"
                className={`${location.pathname === "/main-store/user/dashboard" ? "active" : ""
                  }`}
              >
                <span className="menu-side">
                  <LayoutDashboard className="Dash-iCon" />
                </span>
                <span>Dashboard</span>
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
                  <Link to="/main-store/user/unit-management" className={`${location.pathname === "/main-store/user/unit-management" ||
                    location.pathname === "/main-store/user/manage-unit" ? "active" : ""}`} >
                    UOM
                  </Link>

                  <Link
                    to="/main-store/user/category-management" className={`${location.pathname === "/main-store/user/category-management" ||
                      location.pathname === "/main-store/user/manage-category" ? "active" : ""}`}
                  >
                    Item Category
                  </Link>

                  <Link
                    to="/main-store/user/transport-management"
                    className={`${location.pathname === "/main-store/user/transport-management" ||
                      location.pathname === "/main-store/user/manage-transport" ? "active" : ""}`}
                  >
                    Transport
                  </Link>

                  <Link
                    to="/main-store/user/inventory-location-management" className={`${location.pathname === "/main-store/user/inventory-location-management" || location.pathname === "/main-store/user/manage-inventory-location" ? "active" : ""}`}>
                    Inventory Location
                  </Link>

                  <Link
                    to="/main-store/user/party-group-management"
                    className={`${location.pathname === "/main-store/user/party-group-management" || location.pathname === "/main-store/user/manage-party-group" ? "active" : ""}`}>
                    Party Group
                  </Link>

                  <Link
                    to="/main-store/user/general-master-management"
                    className={`${location.pathname === "/main-store/user/general-master-management" || location.pathname === "/main-store/user/manage-general-master-management" ? "active" : ""}`}>
                    General Master
                  </Link>

                  <Link
                    to="/main-store/user/unit-location-management"
                    className={`${location.pathname === "/main-store/user/unit-location-management" || location.pathname === "/main-store/user/manage-unit-location" ? "active" : ""}`}>
                    Unit Location
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/main-store/user/party-management"
                className={`${location.pathname === "/main-store/user/party-management" || location.pathname === "/main-store/user/manage-party" ? "active" : ""}`}
              >
                <span className="menu-side">
                  <UsersRound className="Dash-iCon" />
                </span>
                <span>Party</span>
              </Link>
            </li>

            <li>
              <Link
                to="/main-store/user/item-management"
                className={`${location.pathname === "/main-store/user/item-management" || location.pathname === "/main-store/user/manage-item" ? "active" : ""}`}>
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
                  to="/main-store/user/getPurchaseRequest"
                  className={`${location.pathname === "/main-store/user/getPurchaseRequest"
                    || location.pathname === '/main-store/user/manage-purchase-request' || location.pathname === '/main-store/user/view-purchase-request'
                    || location.pathname === 'main-store/user/edit-purchase-request-manage' || location.pathname === "/main-store/user/edit-purchase-request-manage" ? "active" : ""}`}
                >
                  Purchase Request
                </Link>

                 <Link
                  to="/main-store/user/getPurchaseRequestViaReorder"
                  className={`${location.pathname === "/main-store/user/getPurchaseRequestViaReorder"
                    || location.pathname === '/main-store/user/ManagePurchaseRequestDetailViaReorder' || location.pathname === '/main-store/user/ViewPurchaseRequestViaReorder'
                    || location.pathname === 'main-store/user/EditPurchaseRequestViaReorder' || location.pathname === "/main-store/user/EditOrderViaReorder " ? "active" : ""}`}
                >
                  Purchase Request vis Re-order
                </Link>

                <Link
                  to="/main-store/user/order-management"
                  className={`${location.pathname === "/main-store/user/order-manage" ||
                    location.pathname === '/main-store/user/manage-order' || location.pathname === '/main-store/user/view-order' || location.pathname === '/main-store/user/order-management' ? "active" : ""}`}
                >
                  Purchase Order
                </Link>

                <Link
                  to="/main-store/user/recieving-management"
                  className={`${location.pathname === "/main-store/user/recieving-management" ||
                    location.pathname === '/main-store/user/manage-recieving' || location.pathname === '/main-store/user/view-recieving' || location.pathname === '/main-store/user/recieving-manage' ? "active" : ""}`}
                >
                  Purchase Recieving
                </Link>

                <Link
                  to="/main-store/user/purchase-return-management"
                  className={`${location.pathname === "/main-store/user/purchase-return-management" ||
                    location.pathname === '/main-store/user/manage-purchase-return' ||
                    location.pathname === '/main-store/user/view-purchase-return' ||
                    location.pathname === '/main-store/user/return-order-manage' ||
                    location.pathname === '/main-store/user/manage-pr' ? "active" : ""}`}
                >
                  Purchase Return
                </Link>

                <Link to="/main-store/user/issue-purchase-management"
                  className={`${location.pathname === '/main-store/user/issue-purchase-management' || location.pathname === '/main-store/user/manage-purchase-issue' || location.pathname === '/main-store/user/view-issue' || location.pathname === '/main-store/user/edit-issue-manage' ? 'active' : ''}`} >
                  Issue
                </Link>
                 
                <Link to="/main-store/user/manage-purchase-item-return"
      className={`${ location.pathname === '/main-store/user/manage-purchase-item-return' || location.pathname === '/main-store/user/view-item-return' || location.pathname === '/main-store/user/edit-item-return-manage' ? 'active' : ''}`}>
  Items Return
</Link>

                <Link to="/main-store/user/issue-purchase-return-management"
                  className={`${location.pathname === '/main-store/user/issue-purchase-return-management' || location.pathname === '/main-store/user/manage-purchase-issue-return' || location.pathname === '/main-store/user/view-issue-return' || location.pathname === '/main-store/user/edit-issue-return-manage' ? 'active' : ''}`} >
                  Issue Return
                </Link>
              </ul>
            </li>

            {/* <li>
              <Link
                to="/main-store/user/stock-management"
                className={`${location.pathname === "/main-store/user/stock-management" ||
                  location.pathname === "/main-store/user/manage-stock" ? "active" : ""}`}
              >
                <span className="menu-side">
                  <Package2 className="Dash-iCon" />
                </span>
                <span>Stock</span>
              </Link>
            </li> */}

                <li className="submenu">
              {/* eslint-disable jsx-a11y/anchor-is-valid */}
              <a
                className={`${stock === true ? "subdrop active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={handleStock}>
                <span className="menu-side">
                  <FileText className="Dash-iCon" />
                </span>
                <span> Stock </span> <span className="menu-arrow" />
              </a>
              <ul style={{ display: stock ? "block" : "none" }}>
                 <Link
                to="/main-store/user/stock-management"
                className={`${location.pathname === "/main-store/user/stock-management" ||
                  location.pathname === "/main-store/user/manage-stock" ? "active" : ""}`}
              >
               
                <span>Stock List</span>
              </Link>
                {/* <Link to="/main-store/user/transfer-stock" className={`${location.pathname === '/main-store/user/transfer-stock' ? "active" : ""}`}>
                  Transfer Stock
                </Link> */}
             
              </ul>
            </li>

            <li className="submenu">
              {/* eslint-disable jsx-a11y/anchor-is-valid */}
              <a
                className={`${report === true ? "subdrop active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={handleReport}>
                <span className="menu-side">
                  <FileText className="Dash-iCon" />
                </span>
                <span> Report </span> <span className="menu-arrow" />
              </a>
              <ul style={{ display: report ? "block" : "none" }}>
                <Link to="/main-store/user/purchase-summary" className={`${location.pathname === '/main-store/user/purchase-summary' ? "active" : ""}`}>
                  Purchase Recieving
                </Link>
                <Link to="/main-store/user/purchase-return-summary" className={`${location.pathname === '/main-store/user/purchase-return-summary' ? "active" : ""}`}>
                  Purchase Return
                </Link>
                <Link to="/main-store/user/issue-summary" className={`${location.pathname === '/main-store/user/issue-summary' ? "active" : ""}`}>
                  Issue
                </Link>
                <Link to="/main-store/user/issue-return-summary" className={`${location.pathname === '/main-store/user/issue-return-summary' ? "active" : ""}`}>
                  Issue Return
                </Link>
                <Link to="/main-store/user/item-ledger" className={`${location.pathname === '/main-store/user/item-ledger' ? "active" : ""}`}>
                  Item Ledger
                </Link>
                <Link to="/main-store/user/reorder-items" className={`${location.pathname === '/main-store/user/reorder-items' ? "active" : ""}`}>
                  Re-order Items
                </Link>
              </ul>
            </li>


          </ul>
        </div>
      </div >
    </div >
  );
};

export default Sidebar;