import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import Header from "../../../Pages/Piping/Include/Header";
import Sidebar from "../../../Pages/Piping/Include/Sidebar";
import Footer from "../../../Pages/Piping/Include/Footer";
import PageHeader from "../Multiple/Components/Breadcrumbs/PageHeader";
import { Link } from "react-router-dom";

const ViewSpoolBreakUpSummary = () => {


    const location = useLocation();

  const data = location.state;
console.log("data in view", data);  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            breadcrumbs={[
              {
                name: "Dashboard",
                link: "/piping/user/dashboard",
                active: false,
              },
              {
                name: "Spool Break-Up Management",
                link: "/piping/user/spool-break-up-summary-list",
                active: false,
              },
              {
                name:"View Spool Break-Up Offer",
                active: true,
              },
            ]}
          />

          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table w-100">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>
                          View Spool Break-Up Summary
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table w-100">
                <div className="card-body">
                   <div className="row align-items-center">
                    <div className="col">
                      <div className="ps-3 pb-3 pt-3 pe-3">
                       <div className="row">
                  <div className="table-responsive">
                    <table className="table border-0 custom-table comman-table mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Drawing No.</th>
                          <th>Spool No.</th>
                           <th>Item Name</th>
                          <th>Item Description</th>
                          <th>Piping Material Specification</th>
                          <th>Material Grade</th>
                          <th>Size 1</th>
                          <th>Thickness 1</th>
                          <th>Size 2</th>
                          <th>Thickness 2</th>
                          <th>UOM</th>
                          <th>Qty</th>
                          <th>Remarks</th>
                         
                        </tr>
                      </thead>

                     <tbody>
  {data?.items?.length > 0 ? (
    data.items.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.drawing_no || "-"}</td>
        <td>{item.spool_no || "-"}</td>
        <td>{item.item_name || "-"}</td>
        <td>{item.item_description || "-"}</td>
        <td>{item.piping_material_specification || "-"}</td>
        <td>{item.material_grade || "-"}</td>
        <td>{item.size1 || "-"}</td>
        <td>{item.thickness1 || "-"}</td>
        <td>{item.size2 || "-"}</td>
        <td>{item.thickness2 || "-"}</td>
        <td>{item.uom || "-"}</td>
        <td>{item.qty || "-"}</td>
        <td>{item.remarks || "-"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="14" className="text-center">
        No Data Found
      </td>
    </tr>
  )}
</tbody>
                    </table>
                  </div>
</div>
                  </div>
                </div>
              </div>
                
                </div>
              </div>
            </div>
          </div>
          
 

            <div className="row">
            <div className="col-sm-12">
              <div className="card card-table w-100">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                    
                        <Link to="/piping/user/spool-break-up-summary-list">
                          <button className="btn btn-primary">Back</button>
                        </Link>
                  
                    </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ViewSpoolBreakUpSummary;
