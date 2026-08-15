import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../Include/Footer';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { Dropdown } from 'primereact/dropdown';
import { getUserMainNdtMaster } from '../../../../Store/Store/Ndt/MainNdtMaster';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';

const ManageFinalDimension = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [dimension, setDimension] = useState({
    drawNo: '',
  });
  const [disable, setDisable] = useState(false);

  const [finalDimension, setFinalDimension] = useState({ req: '', remarks: '' });
  const [drawObj, setDrawObj] = useState({});
  const [tableData, setTableData] = useState([]);
  const [fdDraw, setFdDraw] = useState([]);
  const data = location.state;

  useEffect(() => {
    if (location.state?._id) {
      setDimension({
        drawNo: location?.state?.drawing_id?._id,
      });
      setFinalDimension({
        req: location?.state?.required_dimension,
        remarks: location?.state?.remarks,
      });
      setDrawObj(location?.state?.drawing_id)
      setTableData(location?.state?.items);
    }
  }, [location.state])

  useEffect(() => {
    dispatch(getDrawing());
    dispatch(getUserMainNdtMaster({ status: 2 }));
  }, [dispatch]);

  const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
  const ndtMasterData = useSelector((state) => state?.getUserMainNdtMaster?.user?.data);

  useEffect(() => {

    const fitupDrawIds = ndtMasterData?.map((ft) => ft?.drawing_id);
    const filteredDraw = drawData?.filter((dr) =>
      fitupDrawIds?.includes(dr._id) && dr?.project?._id === localStorage.getItem('U_PROJECT_ID')
    );
    setFdDraw(filteredDraw || []);

    if (ndtMasterData && dimension?.drawNo) {
      const filteredDraw = ndtMasterData?.find(ndt =>
        ndt?.items?.[0]?.transaction_id?.drawingId?._id === dimension.drawNo
      );
      if (!data?._id) {
        if (filteredDraw) {
          setTableData(filteredDraw?.items || []);
          setDrawObj(filteredDraw || {});
        } else {
          toast.error('Ndt Data not found for this drawing.');
          setDrawObj({});
          setTableData([]);
        }
      }
    }
  }, [ndtMasterData, dimension, data?._id, drawData]);

  const handleChange = (e, name) => {
    setDimension({ ...dimension, [name]: e.value });
  }

  const handleChange2 = (e) => {
    setFinalDimension({ ...finalDimension, [e.target.name]: e.target.value });
  }

  const handleSubmit = () => {
    if (validation()) {
      setDisable(true);

      const myurl = `${V_URL}/user/manage-final-dimension-offer`;
      const formData = new URLSearchParams();
      formData.append('ndt_master_id', drawObj._id);
      formData.append('drawing_id', dimension.drawNo);
      formData.append('required_dimension', finalDimension.req);
      formData.append('remarks', finalDimension.remarks);
      formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
      formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
      axios({
        method: "post",
        url: myurl,
        data: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response.data?.success === true) {
          toast.success(response.data.message);
          navigate('/piping/user/final-dimension-offer-management');
        } else {
          toast.error(response.data.message);
        }
        setDisable(false);
      }).catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.');
        setDisable(false);
      })

    }
  }

  const validation = () => {
    let isValid = true;
    let err = {};

    if (!dimension?.drawNo) {
      isValid = false;
      err['drawNo_err'] = 'Please select drawing no.'
    } else if (tableData?.length === 0) {
      isValid = false;
      err['drawNo_err'] = 'Drawing not found in NDT Master.'
    }

    if (!finalDimension.req) {
      isValid = false;
      err['req_err'] = 'Please enter required dimensions'
    }

    setError(err);
    return isValid;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const drawOptions = fdDraw?.map(drawing => ({
    label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
    value: drawing._id
  }));


  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/piping/user/final-dimension-offer-management">Final Dimension Offer List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Final Dimension Offer</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>{data?._id ? 'Edit' : 'Add'} Final Dimension Offer Details</h4>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                          <Dropdown
                            options={drawOptions}
                            value={dimension.drawNo}
                            onChange={(e) => handleChange(e, 'drawNo')}
                            filter className='w-100'
                            placeholder="Select Drawing No."
                            disabled={data?._id}
                          />
                          <div className='error'>{error.drawNo_err}</div>
                        </div>
                      </div>
                    </div>

                    {!data?._id && dimension?.drawNo && Array.isArray(drawObj?.items) && drawObj.items.length > 0 ? (
                      <div className='row'>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="input-block local-forms">
                            <label>Client </label>
                            <input
                              className='form-control'
                              value={drawObj?.items[0]?.transaction_id?.drawingId?.project?.party?.name || ''}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="input-block local-forms">
                            <label>Work Order / PO No. </label>
                            <input
                              className='form-control'
                              value={drawObj?.items[0]?.transaction_id?.drawingId?.project?.work_order_no || ''}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>REV </label>
                              <input
                                className='form-control'
                                value={drawObj?.items[0]?.transaction_id?.drawingId?.rev || ''}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Sheet No. </label>
                              <input
                                className='form-control'
                                value={drawObj?.items[0]?.transaction_id?.drawingId?.sheet_no || ''}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Assembly No. </label>
                              <input
                                className='form-control'
                                value={drawObj?.items[0]?.transaction_id?.drawingId?.assembly_no || ''}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {data?._id ? (
                      <div className='row'>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="input-block local-forms">
                            <label>Client </label>
                            <input
                              className='form-control'
                              value={drawObj?.project?.party?.name || ''}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="input-block local-forms">
                            <label>Work Order / PO No. </label>
                            <input
                              className='form-control'
                              value={drawObj.project?.work_order_no || ''}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>REV </label>
                              <input
                                className='form-control'
                                value={drawObj?.rev || ''}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Sheet No. </label>
                              <input
                                className='form-control'
                                value={drawObj?.sheet_no || ''}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Assembly No. </label>
                              <input
                                className='form-control'
                                value={drawObj?.assembly_no || ''}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className='row'>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Required Dimensions <span className="login-danger">*</span></label>
                          <input className='form-control' value={finalDimension.req} name='req' onChange={handleChange2} readOnly={data?._id} />
                          <div className='error'>{error.req_err}</div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="input-block local-forms">
                          <label>Remarks</label>
                          <textarea className='form-control' value={finalDimension.remarks} name='remarks' onChange={handleChange2} readOnly={data?._id} />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12">
                    <div className="doctor-submit text-end">
                      {!data?._id ? (
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                          disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Generate Final Dimension Offer')}</button>
                      ) : (
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={() => navigate('/piping/user/final-dimension-offer-management')}>Back</button>
                      )}
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
  )
}

export default ManageFinalDimension