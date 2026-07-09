import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Include/Header";
import Sidebar from "../Include/Sidebar";
import Footer from "../Include/Footer";

import { getPartyGroup } from "../../../Store/Store/StoreMaster/PartyGroup/PartyGroup";
import { addParty } from "../../../Store/Store/Party/ManageParty";

import City from "../../../city.json";
import { getPartyTag } from "../../../Store/Store/StoreMaster/PartyTag/PartyTag";
import { getStoreAuthPerson } from "../../../Store/Store/StoreMaster/AuthPerson/AuthPerson";
import toast from "react-hot-toast";
import { P_STORE } from "../../../BaseUrl";

const ManageParty = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [party, setParty] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    address_two: "",
    address_three: "",

    pincode: "",
    pancard_no: "",
    party_tag: "",
    contact_person: "",
    req_no: "",

    gst: "",
    group: "",
  });

  const [disable, setDisable] = useState(false);
  const [error, setError] = useState("");
  const [selectValue, setSelectValue] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const data = location.state;

  useEffect(() => {
    if (localStorage.getItem('PAY_USER_TOKEN') === null) {
      navigate("/user/login");
    } else if (localStorage.getItem('VI_PRO') !== `${P_STORE}`) {
      toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
      navigate("/user/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state) {
      setParty({
        name: location.state.name,
        email: location.state.email,
        phone: location.state.phone,
        address: location.state.address,
        address_two: location.state.address_two,
        address_three: location.state.address_three,
        pincode: location.state.pincode,

        req_no: location.state.req_no,
        pancard_no: location.state.pancard_no,
        gst: location.state.gstNumber,

        group: location.state.partyGroup._id,
        party_tag: location.state.party_tag_id?._id,
        contact_person: location.state.auth_person_id?._id,
      });
      setSelectValue(location.state?.status);
      setSelectedCity(location.state?.city);
      setSelectedState(location.state?.state);
    }
  }, [location.state]);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise?.all([
          dispatch(getPartyGroup()),
          dispatch(getPartyTag()),
          dispatch(getStoreAuthPerson())
        ]);
      } catch (error) {
        console.log(error, '!!');
      }
    };

    fetchInitialData();
  }, [dispatch]);

  const groupData = useSelector((state) => state?.getPartyGroup?.user?.data);
  const tagData = useSelector((state) => state?.getPartyTag?.user?.data);
  const authData = useSelector((state) => state?.getStoreAuthPerson?.user?.data);

  useEffect(() => {
    if (!data?._id) {
      if (tagData && tagData.length > 0) {
        setParty((prevParty) => ({
          ...prevParty,
          party_tag: tagData.find((tag) => tag.name === 'Party')?._id || ''
        }));
      }
    }
  }, [tagData, data?._id]);


  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setSelectedState(selectedState);
    setSelectedCity("");
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setSelectedCity(selectedCity);
  };

  const defaultCountry = City.find((c) => c.iso2 === "IN");
  const states = defaultCountry ? defaultCountry.states : [];
  const cities = states.find((s) => s.name === selectedState)?.cities || [];

  const handleRadioChange = (event) => {
    setSelectValue(event.target.checked);
  };

  const handleChange = (e) => {
    setParty({ ...party, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (validation()) {
      setDisable(true);
      const formData = new URLSearchParams();

      formData.append("firm_id", localStorage.getItem("PAY_USER_FIRM_ID"));
      formData.append("year_id", localStorage.getItem("PAY_USER_YEAR_ID"));

      formData.append("name", party.name);
      formData.append("email", party.email);
      formData.append("phone", party.phone);
      formData.append("address", party.address);

      formData.append("address_two", party.address_two);
      formData.append("address_three", party.address_three);
      formData.append("state", selectedState);
      formData.append("city", selectedCity);
      formData.append("pincode", party.pincode);

      formData.append("req_no", party.req_no);
      formData.append("pancard_no", party.pancard_no);
      formData.append("gstNumber", party.gst);
      formData.append('store_type', '2')
      formData.append("partyGroup", party.group);
      formData.append("party_tag_id", party.party_tag);
      formData.append("auth_person_id", party.contact_person);

      if (data?._id) {
        formData.append("id", data?._id);
        formData.append("status", selectValue);
      }

      dispatch(addParty(formData))
        .then((res) => {

          if (res.payload.success === true) {
            navigate("/product-store/user/party-management");
            setParty({
              name: "",
              address: "",
              phone: "",
              email: "",
              gst: "",
            });
          }
          setDisable(false);
        })
        .catch((error) => {
          setDisable(false);
        });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  }

  const validation = () => {
    var isValid = true;
    let err = {};

    if (!party.name || !party?.name.trim()) {
      isValid = false;
      err["name_err"] = "Please enter name";
    }

    if (party.email) {
      if (!party.email) {
        isValid = false;
        err['email_err'] = "Please enter email"
      } else if (typeof party.email !== "undefined") {
        let lastAtPos = party.email.lastIndexOf('@');
        let lastDotPos = party.email.lastIndexOf('.');
        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && party.email.indexOf('@@') === -1 && lastDotPos > 2 && (party.email.length - lastDotPos) > 2)) {
          isValid = false;
          err["email_err"] = "Email is not valid";
        }
      }
    }

    if (!party.phone) {
      isValid = false;
      err["phone_err"] = "Please enter mobile";
    } else if (!/^\d{10}$/.test(party.phone)) {
      isValid = false;
      err["phone_err"] = "Please enter a valid mobile";
    }

    // if (!party.gst || !party?.gst.trim()) {
    //   isValid = false;
    //   err['gst_err'] = "Please enter gst";
    // }

    if (!party.group) {
      isValid = false;
      err["group_err"] = "Please select group";
    }

    if (!party.address || !party?.address?.trim()) {
      isValid = false;
      err["address_err"] = "Please enter address";
    }

    if (!selectedState) {
      isValid = false;
      err["state_err"] = "Please select state";
    }

    if (!selectedCity) {
      isValid = false;
      err["city_err"] = "Please select city";
    }

    if (!party.pincode) {
      isValid = false;
      err["pincode_err"] = "Please enter pincode";
    }

    if (!party.party_tag) {
      isValid = false;
      err["party_tag_err"] = "Please select tag";
    }

    // if (!party.contact_person) {
    //   isValid = false;
    //   err['contact_person_err'] = "Please select auth person";
    // }

    setError(err);
    return isValid;
  };

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
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/product-store/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/product-store/user/party-management">Party List</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {data?._id ? "Edit" : "Add"} Party
                  </li>
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
                        <h4>{data?._id ? "Edit" : "Add"} Party Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>

                            Name <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            onChange={handleChange}
                            name="name"
                            value={party.name}
                          />
                          <div className="error">{error.name_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Email</label>
                          <input className="form-control" type="email"
                            onChange={handleChange} name='email' value={party.email}
                          />
                          <div className="error">{error.email_err}</div>
                        </div >
                      </div >

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>   Mobile <span className="login-danger">*</span> </label>
                          <input className="form-control" type="number"
                            onChange={handleChange} name="phone"
                            onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                            value={party.phone}
                          />
                          <div className="error">{error.phone_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Address <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            onChange={handleChange}
                            name="address"
                            value={party.address}
                          />
                          <div className="error">{error.address_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Address 2 </label>
                          <input
                            className="form-control"
                            onChange={handleChange}
                            name="address_two"
                            value={party.address_two}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Address 3 </label>
                          <input
                            className="form-control"
                            onChange={handleChange}
                            name="address_three"
                            value={party.address_three}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>State <span className="login-danger">*</span></label>
                          <select className="form-control select"
                            value={selectedState}
                            onChange={handleStateChange} name='state'
                          >
                            <option value="">Select State</option>
                            {states.map((state) => (
                              <option key={state.name} value={state.name}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                          <div className='error'>{error.state_err}</div>
                        </div >
                      </div >
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>City <span className="login-danger">*</span></label>
                          <select className="form-control select"
                            value={selectedCity}
                            onChange={handleCityChange}
                            disabled={!selectedState}
                            name='city'>
                            <option value="">Select City</option>
                            {cities.map((city) => (
                              <option key={city.id} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                          <div className='error'>{error.city_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Pincode <span className="login-danger">*</span></label>
                          <input className="form-control" type="number"
                            onChange={handleChange} name='pincode' value={party.pincode}
                          />
                          <div className='error'>{error.pincode_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Register No.</label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name='req_no' value={party.req_no}
                          />
                          <div className='error'>{error.req_no_err}</div>
                        </div>
                      </div>


                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Pancard No. </label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name='pancard_no' value={party.pancard_no}
                          />
                          <div className='error'>{error.pancard_no_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>GST <span className="login-danger">*</span> </label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="gst"
                            value={party.gst} />
                          <div className="error">{error.gst_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            {" "}
                            Group <span className="login-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            onChange={handleChange}
                            name="group"
                            value={party.group}
                          >
                            <option value="">Select Group</option>
                            {
                              groupData?.map((e) =>
                                <option value={e?._id} key={e?._id}>{e?.name}</option>
                              )
                            }
                          </select >
                          <div className="error">{error.group_err}</div>
                        </div >
                      </div >

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            {" "}
                            Tag <span className="login-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            onChange={handleChange}
                            name="party_tag"
                            value={party.party_tag}
                          >
                            <option value="">Select Tag</option>
                            {
                              tagData?.map((e) =>
                                <option value={e?._id} key={e?._id}>{e?.name}</option>
                              )
                            }
                          </select >
                          <div className="error">{error.party_tag_err}</div>
                        </div >
                      </div >

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Auth Person(Contact Person) </label>
                          <select className="form-select"
                            onChange={handleChange} name='contact_person' value={party.contact_person}
                          >
                            <option value="">Select Auth Person</option>
                            {authData?.map((e) =>
                              <option value={e?._id} key={e?._id}>{e?.name}</option>
                            )}
                          </select>
                          <div className="error">
                            {error.contact_person_err}
                          </div>
                        </div>
                      </div>

                      {data?._id ? (
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="cardNum">
                            <div className="mb-3">
                              <label
                                htmlFor="fileUpload"
                                className="form-label"
                              >
                                Status
                              </label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  onChange={handleRadioChange}
                                  checked={selectValue}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div >
                  </form >
                  <div className="col-12">
                    <div className="doctor-submit text-end">
                      <button
                        type="button"
                        className="btn btn-primary submit-form me-2"
                        onClick={handleSubmit}
                        disabled={disable}
                      >
                        {disable
                          ? "Processing..."
                          : data?._id
                            ? "Update"
                            : "Submit"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary cancel-form"
                        onClick={() =>
                          setParty({
                            name: "",
                            email: "",
                            phone: "",
                            address: "",
                            gst: "",
                          })
                        }
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div >
              </div >
            </div >
          </div >
        </div >

        <Footer />
      </div >
    </div >
  );
};

export default ManageParty;
