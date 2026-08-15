import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DropDown from '../../../../../Components/DropDown';
import { Pagination, Search } from '../../../Table';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';


const MultiFdTable = ({ data, finalArr, handleSaveClick, handleRemove }) => {

    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [tableData, setTableData] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({ required_dimension: '', remarks: '' });
    const [editIndex, setEditIndex] = useState(null);
const [editedData, setEditedData] = useState({});

console.log("data in multi fd table ", data);
    useEffect(() => {
        getFDOfferTable();
    }, [localStorage.getItem('U_PROJECT_ID'), localStorage.getItem('issue_acc_ids'), localStorage.getItem('ndt_master_ids'), finalArr])

    const getFDOfferTable = () => {
        const formData = new URLSearchParams();
        formData.append('project', localStorage.getItem('U_PROJECT_ID'));
        formData.append('issue_acc_id', localStorage.getItem('issue_acc_ids') ? localStorage.getItem('issue_acc_ids') : []);
        formData.append('ndt_master_id', localStorage.getItem('ndt_master_ids') ? localStorage.getItem('ndt_master_ids') : []);
    }

  

    useEffect(() => {
        const filterFdTable = data?.items?.filter((item) => !item.required_dimension);
        if (filterFdTable?.length > 0 && !data?._id) {
            setTableData(filterFdTable)
            // setSubmitArr(filterFdTable);
        } else if (data?.items?.length > 0) {
            setTableData(data.items);
            // setSubmitArr(data.items);
        } else {
            setTableData([]);
            // setSubmitArr([]);
        }
    }, [finalArr, data]);


    const handleCancelClick = () => {
        setEditRowIndex(null);
    };



const handleChange = (e, index) => {
    const { name, value } = e.target;

    setEditedData(prev => ({
        ...prev,
        [name]: value
    }));
};

    const filteredData = useMemo(() => {
    if (!search) return data || [];

    return data?.filter((elem) => {
        const item = elem?.items?.[0];

        return (
            elem?.drawing_no?.toLowerCase().includes(search) ||
            elem?.rev?.toLowerCase().includes(search) ||
            elem?.sheet_no?.toLowerCase().includes(search) ||
            elem?.PipingMaterialSpecification?.name?.toLowerCase().includes(search) ||
            elem?.spool_no?.spool_no?.toLowerCase().includes(search) ||
            item?.required_dimension?.toLowerCase().includes(search) ||
            item?.remarks?.toLowerCase().includes(search)
        );
    });
}, [search, data]);

 

    return (
        <>
            <div className='row'>
                <div className="col-sm-12">
                    <div className="card card-table show-entire">
                        <div className="card-body">
                            <div className="page-table-header mb-2">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <div className="doctor-table-blk">
                                            <h3>Item Details List</h3>
                                            <div className="doctor-search-blk">
                                                <div className="top-nav-search table-search-blk">
                                                    <form>
                                                        <Search
                                                            onSearch={(value) => {
                                                                setSearch(value.toLowerCase());
                                                                setCurrentPage(1);
                                                            }}
                                                        />
                                                        <a className="btn">
                                                            <img src="/assets/img/icons/search-normal.svg" alt="search" />
                                                        </a>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                        {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive mt-2">
                                <table className="table border-0 custom-table comman-table  mb-0">
                                    <thead>
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Drawing No.</th>
                                            <th>Rev</th>
                                            {/* <th>Sheet No.</th> */}
                                            <th>Piping Material Specification</th>
                                            <th>Spool No.</th>                                          
                                            <th>Required Dimensions</th>
                                            <th>Remarks</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                  <tbody>
{filteredData?.map((elem, i) => {
    const item = elem?.items?.[0];

    const isEditing = editIndex === i;

    return (
  <tr
  key={i}
  onClick={() => {
    if (editIndex !== i) {
      setEditIndex(i);
      setEditedData({
        required_dimension: item?.required_dimension || "",
        remarks: item?.remarks || "",
      });
    }
  }}
  style={{ cursor: "pointer" }}
>


            <td>{i + 1}</td>

            <td>{elem?.drawing_no}</td>
            <td>{elem?.rev}</td>
            {/* <td>{elem?.sheet_no}</td> */}
            <td>{elem?.PipingMaterialSpecification?.name}</td>
            <td>{elem?.spool_no?.spool_no}</td>

            {/* 🔥 Editable Required Dimension */}
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        name="required_dimension"
                        value={editedData.required_dimension ?? item?.required_dimension ?? ""}
                        onChange={(e) => handleChange(e, i)}
                         onClick={(e) => e.stopPropagation()}
                        className="form-control"
                    />
                ) : (
                    elem?.required_dimension || "-"
                )}
            </td>

            {/* 🔥 Editable Remarks */}
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        name="remarks"
                        value={editedData.remarks ?? item?.remarks ?? ""}
                        onChange={(e) => handleChange(e, i)}
                         onClick={(e) => e.stopPropagation()}
                        className="form-control"
                    />
                ) : (
                    elem?.remarks || "-"
                )}
            </td>

            {/* 🔥 Action Buttons */}
            <td>
                {isEditing ? (
                    <>
                                          <button
  className="btn btn-success btn-sm me-2"
  onClick={(e) => {
    e.stopPropagation();
    handleSaveClick(i, elem, editedData);
    setEditIndex(null);
  }}
>
  <Save />
</button>

                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditIndex(null)}
                        >
                            <X  />
                        </button>
                        
                    </>
                ) : (
                     <button
  className="btn btn-danger btn-sm"
  onClick={(e) => {
    e.stopPropagation();
    handleRemove(elem._id);
  }}
>
  Delete
</button>
                )}
            </td>
        </tr>
    );
})}

  {filteredData?.length === 0 && (
                <tr>
                  <td colSpan="999">
                    <div className="no-table-data">No Data Found!</div>
                  </td>
                </tr>
              )}
</tbody>

                                </table>
                            </div>
                            {/* <div className="row align-center mt-3 mb-2">
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                    <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                        aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                    <div className="dataTables_paginate paging_simple_numbers"
                                        id="DataTables_Table_0_paginate">
                                        <Pagination
                                            total={totalItems}
                                            itemsPerPage={limit}
                                            currentPage={currentPage}
                                            onPageChange={(page) => setCurrentPage(page)}
                                        />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MultiFdTable