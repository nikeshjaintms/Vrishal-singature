import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPaintRequirementMaster } from '../../../../Store/Piping/PaintRequirementMaster/PaintRequirementMaster';
import { getUserPipingClassMaster } from '../../../../Store/Piping/PipingClass/PipingClassMaster';
import { MultiSelect } from "primereact/multiselect";

const ManagePaintingSystem = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [availableServices, setAvailableServices] = useState([]); 
    const [paint, setPaint] = useState({
        pipingClass: "",
        service: [],
        // piping_material_specifiation: "",
        blasting_painting_requirements: "",
        paint_system_no: "",
    });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [selectValue, setSelectValue] = useState('');
    const data = location.state;

    console.log("data", data);


    // useEffect(() => {
    //     if (location.state) {
    //         setPaint({
    //             pipingClass: location.state?.pipingClass,
    //             service: location.state.service || [],
    //             // piping_material_specifiation: location.state?.piping_material_specifiation,
    //             blasting_painting_requirements: location.state?.blasting_painting_requirements,
    //             paint_system_no: location.state?.paint_system_no,
    //         });
    //         setSelectValue(location.state?.status);
    //     }
    // }, [location.state]);

    

    useEffect(() => {
        dispatch(getUserPaintRequirementMaster({ status: true }));
    }, [dispatch]);

    const handleSubmit = () => {
        
        if (validation()) {
            console.log('click');
            setDisable(true);
            const myurl = `${V_URL}/user/manage-paint-requirement`;
            const formData = new URLSearchParams();
            formData.append('pipingClass', paint.pipingClass);
            formData.append('service', JSON.stringify(paint.service.map(s => s._id)));
            // formData.append('piping_material_specifiation', paint.piping_material_specifiation);
            formData.append('blasting_painting_requirements', paint.blasting_painting_requirements);
            formData.append('project', localStorage.getItem('U_PROJECT_ID'));
            formData.append('paint_system_no', paint.paint_system_no);
            if (data?._id) {
                formData.append('_id', data._id);
                formData.append('status', selectValue);
            }
            axios.post(myurl, formData, {
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded", 
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') 
                },
            })
            .then((response) => {
                if (response.data.success) {
                    navigate('/piping/user/painting-requirement-management');
                    toast.success(response.data.message);
                    handleReset();
                } else {
                    toast.error(response.data.message || "Save failed");
                }
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'Something went wrong');
            })
        }
    }

    const handleReset = () => {
        setPaint({
            pipingClass: "",
            service: [],
            // piping_material_specifiation: "",
            blasting_painting_requirements: "",
            paint_system_no: "",
        })
    }

   const validation = () => {
        let isValid = true;
        let err = {};

        if (!paint.pipingClass || paint.pipingClass.trim() === "") {
            isValid = false;
            err.pipingClass_err = "Piping Class is required";
        }
        if (!paint.service || paint.service.length === 0) {
            isValid = false;
            err.service_err = "Please Select Service";
        }
        // if (!paint.piping_material_specifiation || paint.piping_material_specifiation.trim() === "") {
        //     isValid = false;
        //     err.piping_material_specifiation_err = "Piping Material Specification is required";
        // }

        if (!paint.blasting_painting_requirements || paint.blasting_painting_requirements.trim() === "") {
            isValid = false;
            err.blasting_painting_requirements_err = "Blasting - Painting Requirement is required";
        }

        if (!paint.paint_system_no || paint.paint_system_no.trim() === "") {
            isValid = false;
            err.paint_system_no_err = "Paint System No is required";
        }

        setError(err);
        return isValid;
    };

    const handleChange = (e) => {
    const { name, value } = e.target;

    setPaint((prev) => ({
        ...prev,
        [name]: value,
    }));

    // When Piping Class changes
    if (name === "pipingClass") {
    const selectedClass = pipingClassData.find((p) => p._id === value);

    if (selectedClass && selectedClass.Items?.length > 0) {
        setAvailableServices(selectedClass.Items);
        // Reset services selection to empty array (MultiSelect expects array of objects)
        setPaint((prev) => ({
            ...prev,
            pipingClass: value,
            service: [],
        }));
    } else {
        setAvailableServices([]);
        setPaint((prev) => ({
            ...prev,
            pipingClass: value,
            service: [],
        }));
    }
}


    // When Service changes
    else if (name === "service") {
        const selectedService = availableServices.find(
            (item) => item.service === value
        );

        setPaint((prev) => ({
            ...prev,
            service: value,
            // piping_material_specifiation:
            //     selectedService?.PipingMaterialSpecification?.name || "",
        }));
    }
};

  
    const pipingClassData = useSelector((state) => state?.getUserPipingClassMaster?.user?.data || []);
    useEffect(() => {
        // const projectId = localStorage.getItem("U_PROJECT_ID"); // current project
        dispatch(getUserPipingClassMaster({
            status: 1,
            project: localStorage.getItem("U_PROJECT_ID")
        }));
    }, [dispatch]);
    useEffect(() => {
    if (!location.state || pipingClassData.length === 0) return;

    const editData = location.state;

    // 1️⃣ Find selected piping class
    const selectedClass = pipingClassData.find(
        (p) => p._id === editData.pipingClass._id
    );

    const allServices = selectedClass?.Items || [];

    // 2️⃣ Map service NAMES to service OBJECTS
    const mappedServices = allServices.filter(s =>
        editData.service.includes(s.service)
    );

    setPaint({
        pipingClass: selectedClass._id, // ✅ ID only
        service: mappedServices,         // ✅ objects
        blasting_painting_requirements: editData.blasting_painting_requirements,
        paint_system_no: editData.paint_system_no,
    });

    setAvailableServices(allServices);

}, [location.state, pipingClassData]);


// console.log("paint", paint);

//     useEffect(() => {
//     if (!location.state || pipingClassData.length === 0) return;

//     const selectedClass = pipingClassData.find(
//         (p) => p._id === location.state.pipingClass
//     );

//     const allServices = selectedClass?.Items || [];

//     // location.state.service might be array of service IDs, so map to full service objects
//     const mappedServices = Array.isArray(location.state.service)
//         ? allServices.filter(service => location.state.service.includes(service._id))
//         : [];

//     setPaint({
//         pipingClass: location.state.pipingClass,
//         service: mappedServices,
//         blasting_painting_requirements: location.state.blasting_painting_requirements,
//         paint_system_no: location.state.paint_system_no,
//     });

//     setAvailableServices(allServices);
// }, [location.state, pipingClassData]);




    const handleMultiSelectChange = (e) => {
    setPaint((prev) => ({
        ...prev,
        service: e.value, // e.value is array of selected service objects
    }));

    // Example: If you want to do something with the first selected service, fix this way:
    if (e.value.length > 0) {
        const firstSelected = e.value[0]; // object of first selected service
        const selectedService = availableServices.find(item => item._id === firstSelected._id);
        // Optional: update piping_material_specifiation or other state here if needed
    } else {
        // Optional: clear piping_material_specifiation if needed
    }
};


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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/piping/user/painting-requirement-management">Painting Requirement List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Painting Requirement</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Painting Requirement Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Piping Class <span className="login-danger">*</span></label>
                                                        <select className="form-control" name="pipingClass" value={paint.pipingClass} onChange={handleChange} >
                                                            <option value="">-- Select Piping Class --</option>
                                                            {pipingClassData.map((pclass) => (
                                                            <option key={pclass._id} value={pclass._id}> {pclass.PipingClass} </option>
                                                            ))}
                                                        </select>
                                                    <div className='error'>{error.pipingClass_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Services <span className="login-danger">*</span></label>
                                                        <MultiSelect
                                                            value={paint.service}
                                                            options={availableServices}
                                                            onChange={handleMultiSelectChange}
                                                            optionLabel="service"
                                                            placeholder="-- Select Service --"
                                                            display="chip"      
                                                            disabled={!availableServices.length}
                                                            className="w-100 multi-prime-react"
                                                        />
                                                    <div className='error'>{error?.service_err}</div>
                                                </div>
                                            </div>

                                            {/* <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                <label> Piping Material Specification{" "} <span className="login-danger">*</span></label>
                                                <input type="text" className="form-control" name='piping_material_specifiation'  value={paint.piping_material_specifiation} disabled />
                                                
                                                <div className='error'>{error?.piping_material_specifiation_err}</div>
                                                </div>
                                            </div> */}

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Blasting - Painting Requirements <span className="login-danger">*</span></label>
                                                    <select className='form-control form-select' name='blasting_painting_requirements' onChange={handleChange} value={paint.blasting_painting_requirements}>
                                                        <option value="">Select Paint Manufacture</option>
                                                        <option value="Yes">Yes</option>
                                                        <option value="NO">No</option>
                                                    </select>
                                                    <div className='error'>{error.blasting_painting_requirements_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Paint System No. <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='paint_system_no'
                                                        onChange={handleChange} value={paint.paint_system_no} />
                                                    <div className='error'>{error.paint_system_no_err}</div>
                                                </div>
                                            </div>


                                        </div>

                                        <div className="col-12 text-end">
                                            <div className="doctor-submit text-end">
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                                                <button type="button"
                                                    className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <Footer />
            </div >
        </div >
    )
}

export default ManagePaintingSystem