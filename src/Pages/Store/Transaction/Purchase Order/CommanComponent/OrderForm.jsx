import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { getGenMaster } from "../../../../../Store/Store/GenralMaster/GenMaster";
import { getParty } from "../../../../../Store/Store/Party/Party";
import { getProject } from "../../../../../Store/Store/Project/Project";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const OrderForm = ({
  title,
  tag_number,
  isEdit,
  FormData,
  orderFormData,
  handleFormChange,
  orderError,
  setOrderFormData,
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getGenMaster({ tag_id: tag_number }));
    dispatch(getParty({ storeType: "1", is_main: true }));
    dispatch(getProject());
  }, []);
  const parties = useSelector((state) => state.getParty?.user?.data || []);
  const reciever = useSelector((state) => state.getGenMaster?.user?.data || []);
  const projects = useSelector((state) => state.getProject?.user?.data || []);



  useEffect(() => {
    if (isEdit && FormData) {
      setOrderFormData({
        id: FormData?._id || "",
        order_date: moment(FormData?.trans_date).format("YYYY-MM-DD") || "",
        
        party_id: FormData?.party_data?._id || "",
        project_id: FormData?.project_data?._id || "",
        master_id: FormData?.create_by?._id || "",
        voucher_no: FormData?.voucher_no || "",
        is_edit: isEdit,
      });
    }
  }, [isEdit, FormData, setOrderFormData]);


 useEffect(() => {
    if (!isEdit && !orderFormData?.order_date) {
      const today = new Date().toISOString().split("T")[0];
      setOrderFormData((prev) => ({
        ...prev,
        order_date: today,
      }));
    }
  }, [isEdit, orderFormData, setOrderFormData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    handleFormChange(name, value);
  };



  
  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-body">
            <div className="col-12 d-flex justify-content-between">
              <div className="form-heading">
                <h4>{title}</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>
                    Party Name <span className="login-danger">*</span>
                  </label>
                  <Dropdown
                    value={orderFormData?.party_id} // The selected _id
                    options={parties?.map((item) => ({
                      label: item.name, // Display name
                      value: item._id, // Store _id
                    }))}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "party_id", value: e.value },
                      })
                    }
                    placeholder="Select Party"
                    filter
                    filterBy="label"
                    appendTo="self"
                    className="w-100 multi-prime-react model-prime-multi"
                  />
                  {orderError?.party_id && (
                    <div className="error">{orderError.party_id}</div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>
                    Order Date <span className="login-danger">*</span>
                  </label>

                  <input
                    className="form-control"
                    type="date"
                    name="order_date"
                  value={orderFormData?.order_date}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                  />


                

                  {orderError?.order_date && (
                    <div className="error">{orderError.order_date}</div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>
                    PO Create Name <span className="login-danger">*</span>
                  </label>
                  <Dropdown
                    value={orderFormData?.master_id}
                    options={reciever?.map((item) => ({
                      label: item.name, // Display name
                      value: item._id, // Store _id
                    }))}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "master_id", value: e.value },
                      })
                    }
                    placeholder="Select PO Creator"
                    filter
                    filterBy="label"
                    appendTo="self"
                    className="w-100 multi-prime-react model-prime-multi"
                  />
                  {orderError?.master_id && (
                    <div className="error">{orderError.master_id}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>
                    Project Name <span className="login-danger">*</span>
                  </label>
                  <Dropdown
                    value={orderFormData?.project_id}
                    options={projects?.map((item) => ({
                      label: item.name, // Display name
                      value: item._id, // Store _id
                    }))}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "project_id", value: e.value },
                      })
                    }
                    placeholder="Select Project"
                    filter
                    filterBy="label"
                    appendTo="self"
                    className="w-100 multi-prime-react model-prime-multi"
                  />
                  {orderError?.project_id && (
                    <div className="error">{orderError.project_id}</div>
                  )}
                </div>
              </div>

              {isEdit && (
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block local-forms">
                    <label>PO No.</label>
                    <input
                      className="form-control"
                      type="number"
                      name="order_date"
                      value={orderFormData?.voucher_no}
                      disabled
                    />
                    {/* {orderError?.order_date && <div className="error">{orderError.order_date}</div>} */}
                  </div>
                </div>
              )}
            </div>
            {/* <div className='row'> */}
            {isEdit && (
              <div className="col-sm-12">
                <div className="col-12 text-end">
                  <div className="doctor-submit text-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      save
                    </button>
                  </div>
                </div>
                {/* </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
