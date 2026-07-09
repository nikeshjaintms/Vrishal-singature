import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link } from 'react-router-dom';
import Footer from '../Include/Footer';
import Loader from '../Include/Loader';
import { Search } from '../Table';
import { getStockReportList } from '../../../Store/Store/Stock/getStockReportList';
import Top from '../Include/Top';
import toast from 'react-hot-toast';
import axios from 'axios';
import { V_URL } from '../../../BaseUrl';
import { getReusableList } from '../../../Store/Store/Stock/getReusableList';
import ReusableListModal from './ReusableListModal';

const ReusableStock = () => {

    const dispatch = useDispatch();
    const [disable, setDisable] = useState(true)
    const [search, setSearch] = useState("");
    const [stockList, setStockList] = useState([]);
    const [errors, setErrors] = useState({});
    const [disable2, setDisable2] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (disable === true) {
            dispatch(getStockReportList());
            dispatch(getReusableList(localStorage.getItem('U_PROJECT_ID')));
            setDisable(false);
        }
    }, [disable, dispatch]);

    const entity = useSelector((state) => state.getStockReportList?.user?.data);
    const reusableData = useSelector((state) => state.getReusableList?.user?.data);

    useEffect(() => {
        if (entity?.length) {
            const filteredEntity = entity.filter((item) => {
                const isMatched = reusableData?.some((reuse) =>
                    item.itemId === reuse.item_id &&
                    item.imir_no === reuse.imir_no &&
                    item.material_po_no === reuse.material_po_no &&
                    item.supplier_id === reuse.supplier_id &&
                    item.manufacture_id === reuse.manufacture_id
                );
                return !isMatched;
            });

            const enriched = filteredEntity?.map((item) => ({
                ...item,
                usableLength: '',
                usableWidth: '',
                usableNos: '',
                usableQty: '',
                remarks: '',
            }));
            setStockList(enriched);
        }
    }, [entity, reusableData]);

    const commentsData = useMemo(() => {
        let computedComments = stockList;
        if (search) {
            computedComments = computedComments.filter(
                (st) =>
                    st.material_po_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    st.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    st.imir_no?.toString().toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        return computedComments;
    }, [search, stockList]);

    const handleInputChange = (index, field, value) => {
        const updatedList = [...stockList];
        const updatedErrors = { ...errors };
        updatedList[index][field] = value;
        if (field === 'usableQty') {
            const balanceQty = Number(updatedList[index]?.balance_qty || 0);
            const usableQty = Number(value);

            if (usableQty > balanceQty) {
                updatedErrors[index] = {
                    ...(updatedErrors[index] || {}),
                    usableQty: `Usable Qty can't exceed Balance Qty (${balanceQty})`,
                };
            } else {
                if (updatedErrors[index]) {
                    delete updatedErrors[index].usableQty;
                    if (Object.keys(updatedErrors[index]).length === 0) {
                        delete updatedErrors[index];
                    }
                }
            }
        }
        setErrors(updatedErrors);
        setStockList(updatedList);
    };

    const handleSubmit = () => {
        const formattedData = stockList.map(item => ({
            material_po_no: item.material_po_no,
            itemId: item.itemId,
            imir_no: item.imir_no,
            accepted_lot_no: item.accepted_lot_no,
            balance_qty: item.balance_qty,
            manufacture_id: item.manufacture_id,
            supplier_id: item.supplier_id,
            remarks: item.remarks,
            usableLength: Number(item.usableLength) || 0,
            usableWidth: Number(item.usableWidth) || 0,
            usableNos: Number(item.usableNos) || 0,
            usableQty: Number(item.usableQty) || 0,
            project_id: localStorage.getItem('U_PROJECT_ID')
        }));

        const filterStock = formattedData?.filter((e) => e?.usableQty > 0);
        if (filterStock?.length === 0) {
            toast.error("Please add atleast one reusable stock");
            return
        }
        const hasErrors = Object.values(errors).some(err => Object.keys(err).length > 0);
        if (hasErrors) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        setDisable2(true);
        const myurl = `${V_URL}/user/add-usable-stock`;
        const formData = new URLSearchParams();
        formData.append('items', JSON.stringify(filterStock))
        axios({
            method: 'Post',
            url: myurl,
            data: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then((response) => {
            const { success, message } = response?.data
            if (success) {
                toast.success(message);
                setDisable(true);
            }
        }).catch((error) => {
            toast.error(error?.response?.data?.message);
        }).finally(() => {
            setDisable2(false);
        })
    };

    const handleRefresh = () => {
        setDisable(true);
        setSearch('');
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Reusable Stock List</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {disable === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Reusable Stock List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    <Search
                                                                        onSearch={(value) => {
                                                                            setSearch(value);
                                                                        }} />
                                                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                        alt="search" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                            <div className='mx-2'>
                                                                <button className='btn btn-primary' type='button' onClick={handleSubmit}
                                                                    disabled={disable2}
                                                                >{disable2 ? "Processing..." : "Submit"}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">

                                                    <div className=''>
                                                        <button className='btn btn-primary' type='button' onClick={() => setShow(true)}>Show Reusable Stock List</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>SR.</th>
                                                        <th>MATERIAL PO No.</th>
                                                        <th>SECTION DETAILS</th>
                                                        <th>GRADE</th>
                                                        <th>UOM</th>
                                                        <th>IMIR NO.</th>
                                                        <th>HEAT NO.</th>
                                                        <th>AVAILABLE QTY(KG)</th>
                                                        <th>MANUFACTURER</th>
                                                        <th>SUPPLIER</th>
                                                        <th>USABLE LENGTH</th>
                                                        <th>USABLE WIDTH</th>
                                                        <th>USABLE NOS</th>
                                                        <th>USABLE QTY(KG)</th>
                                                        <th>REMARKS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{i + 1}</td>
                                                            <td>{elem?.material_po_no}</td>
                                                            <td>{elem?.name}</td>
                                                            <td>{elem?.material_grade || '-'}</td>
                                                            <td>{elem?.unit}</td>
                                                            <td>{elem?.imir_no || '-'}</td>
                                                            <td>{elem?.accepted_lot_no}</td>
                                                            <td>{(elem.balance_qty)?.toFixed(2)}</td>
                                                            <td>{elem?.manufacture || '-'}</td>
                                                            <td>{elem?.mainSupplierName || '-'}</td>
                                                            <td>
                                                                <input
                                                                    type='number'
                                                                    className='form-control'
                                                                    value={elem.usableLength}
                                                                    onChange={(e) => handleInputChange(i, 'usableLength', e.target.value)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type='number'
                                                                    className='form-control'
                                                                    value={elem.usableWidth}
                                                                    onChange={(e) => handleInputChange(i, 'usableWidth', e.target.value)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type='number'
                                                                    className='form-control'
                                                                    value={elem.usableNos}
                                                                    onChange={(e) => handleInputChange(i, 'usableNos', e.target.value)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type='number'
                                                                    className={`form-control ${errors[i]?.usableQty ? 'is-invalid' : ''}`}
                                                                    value={elem.usableQty}
                                                                    onChange={(e) => handleInputChange(i, 'usableQty', e.target.value)}
                                                                />
                                                                {errors[i]?.usableQty && (
                                                                    <div className="invalid-feedback">
                                                                        {errors[i].usableQty}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <textarea
                                                                    className='form-control'
                                                                    value={elem.remarks}
                                                                    onChange={(e) => handleInputChange(i, 'remarks', e.target.value)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {commentsData?.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="999">
                                                                <div className="no-table-data">
                                                                    No Data Found!
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : null}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : <Loader />}
                    <Top />
                </div>
                <Footer />
            </div>
            <ReusableListModal show={show} reusableData={reusableData} handleClose={() => setShow(false)} />
        </div>
    )
}

export default ReusableStock