import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SubmitButton = ({
  procedure,
  finalReq = [],
  disable,
  handleSubmit,
  buttonName,
  showWeldInspection,
  isFd,
  isFitUP,
  isPainting,
  isDispatch,
  showPressureTest = false,
  showMioClearance = false,
  showSurfaceClearance = false,
  handleStatusChange,
  link,
  data,
  showFinalDimension = false,
  showFitUp = false,
  showStockIssue = false,
  is_dispatch = false,
  onChange,
  dispatch_site,
  paintRequirements,
  isRT,
  rtLocationValue,
  handleRtLocationChange,
  ndtContractors,
  contractorId,
  setContractorId,
  submitArr,
}) => {
  // const SubmitButton = ({ procedure, finalReq = [], disable, handleSubmit, buttonName, showWeldInspection, isFd, isFitUP, isPainting, isDispatch, showPressureTest = false, showMioClearance = false, showSurfaceClearance = false, handleStatusChange, link, data, showFinalDimension = false, showFitUp = false, is_dispatch = false, onChange, dispatch_site, paintRequirements, submitArr }) => {

  const navigate = useNavigate();
  const selectedProcedure =
    procedure ||
    (isFitUP ? "fitup" : null) ||
    (isPainting ? "painting" : null) ||
    (isDispatch ? "dispatch" : null);
  // (showWeldInspection ? "weld_visual_offer" : null);

  const [formData, setFormData] = useState({
    dispatch_site: "",
    release_date: "",
    paint_system: "",
    isSurface: false,
    isMio: false,
    isFp: false,
    isIrn: false,
     isBlastingPainting: false,
  isDirectDispatch: false,
  });

  useEffect(() => {
    if (is_dispatch && submitArr?.length > 0) {
      // Find the first item that has a paint_system_id
      const firstPaintItem = submitArr.find((item) => item.paint_system_id);

      // User mentioned: when i click on handleAddToIssueArr you will find piping_class according auto fetch the paint_system_no
      if (firstPaintItem?.piping_class) {
        console.log(
          "🔍 Auto-fetching paint system for piping_class:",
          firstPaintItem.piping_class,
        );
      }

      if (firstPaintItem && !formData.paint_system) {
        setFormData((prev) => ({
          ...prev,
          paint_system: firstPaintItem.paint_system_id,
        }));
      }
    }
  }, [submitArr, is_dispatch]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => {
      let newData = { ...prev, [name]: checked };

      // Surface selected -> select all
      if (name === "isSurface" && checked) {
        newData.isMio = true;
        newData.isFp = true;
        newData.isIrn = true;
      }

      // MIO selected -> uncheck Surface, select Final Coat & Site Dispatch
      if (name === "isMio" && checked) {
        newData.isSurface = false;
        newData.isFp = true;
        newData.isIrn = true;
      }

      // Final Coat selected -> uncheck Surface & MIO, select Site Dispatch
      if (name === "isFp" && checked) {
        newData.isSurface = false;
        newData.isMio = false;
        newData.isIrn = true;
      }

      return newData;
    });
  };

  const handleSurfaceRadioChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      isMio: value === "mio",
      isIrn: value === "site_dispatch",
      isSurface: false,
      isFp: false,
    }));
  };

  const handleMioRadioChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      isFp: value === "final_coat",
      isIrn: value === "site_dispatch",
      isSurface: false,
      isMio: false,
    }));
  };

  const handleFpRadioChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      isIrn: value === "site_dispatch",
      isSurface: false,
      isMio: false,
      isFp: false,
    }));
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              {showFitUp && (
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block select-gender">
                    <label className="gen-label">
                      Select Procedure <span className="login-danger">*</span>
                    </label>

                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure"
                          value="fitup"
                          checked={selectedProcedure === "fitup"}
                          onChange={handleStatusChange}
                          className="form-check-input"
                          disabled={data?._id}
                        />
                        Fitup
                      </label>
                    </div>

                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure"
                          value="painting"
                          checked={selectedProcedure === "painting"}
                          onChange={handleStatusChange}
                          className="form-check-input"
                          disabled={data?._id}
                        />
                        Release for Painting
                      </label>
                    </div>

                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure"
                          value="dispatch"
                          checked={selectedProcedure === "dispatch"}
                          onChange={handleStatusChange}
                          className="form-check-input"
                          disabled={data?._id}
                        />
                        Release Note for Site Dispatch
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {showStockIssue && (
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block select-gender">
                    <label className="gen-label">
                      Select Procedure <span className="login-danger">*</span>
                    </label>


                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure"
                          value="painting"
                          checked={selectedProcedure === "painting"}
                          onChange={handleStatusChange}
                          className="form-check-input"
                          disabled={data?._id}
                        />
                        Release for Painting
                      </label>
                    </div>

                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure"
                          value="dispatch"
                          checked={selectedProcedure === "dispatch"}
                          onChange={handleStatusChange}
                          className="form-check-input"
                          disabled={data?._id}
                        />
                        Release Note for Site Dispatch
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {showWeldInspection && (
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block select-gender">
                    <label className="gen-label">
                      Select Procedure <span className="login-danger">*</span>
                    </label>

                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure"
                          value="weld_visual_offer"
                          checked={selectedProcedure === "weld_visual_offer"}
                          onChange={handleStatusChange}
                          className="form-check-input"
                          disabled={data?._id}
                        />
                        Release for Weld Visual Offer
                      </label>
                    </div>

                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure"
                          value="root_dpt"
                          checked={selectedProcedure === "root_dpt"}
                          onChange={handleStatusChange}
                          className="form-check-input"
                          disabled={data?._id}
                        />
                        Release for Root DPT
                      </label>
                    </div>
                  </div>
                </div>
              )}

             {showFinalDimension && (
  <div className="col-12 col-md-4 col-xl-4">
    <div className="input-block select-gender">
      <label className="gen-label">
        Select Procedure <span className="login-danger">*</span>
      </label>

      <div className="form-check">
        <label className="form-check-label">
          <input
            type="radio"
            name="isFd"
            value="hydro_testing"
            checked={isFd === "hydro_testing"}
            onChange={handleStatusChange}
            className="form-check-input"
            disabled={data?._id}
          />
          Release for Hydro Testing
        </label>
      </div>

      <div className="form-check">
        <label className="form-check-label">
          <input
            type="radio"
            name="isFd"
            value="blasting_painting"
            checked={isFd === "blasting_painting"}
            onChange={handleStatusChange}
            className="form-check-input"
            disabled={data?._id}
          />
          Release for Blasting & Painting
        </label>
      </div>

      <div className="form-check">
        <label className="form-check-label">
          <input
            type="radio"
            name="isFd"
            value="site_dispatch"
            checked={isFd === "site_dispatch"}
            onChange={handleStatusChange}
            className="form-check-input"
            disabled={data?._id}
          />
          Release for Site Dispatch
        </label>
      </div>
    </div>
  </div>
)}


            {showPressureTest && (
  <div className="col-12 col-md-4 col-xl-4">
    <div className="input-block select-gender">
      <label className="gen-label">
        Select Procedure <span className="login-danger">*</span>
      </label>

      <div className="form-check">
        <label className="form-check-label">
          <input
            type="radio"
            name="isBlastingPainting"
            checked={formData.isBlastingPainting === true}
            onChange={() =>
              setFormData(prev => ({
                ...prev,
                isBlastingPainting: true,
                isSiteDispatch: false
              }))
            }
            className="form-check-input"
          />
          Release for Blasting & Painting
        </label>
      </div>

      <div className="form-check">
        <label className="form-check-label">
          <input
            type="radio"
            name="isSiteDispatch"
            checked={formData.isSiteDispatch === true}
            onChange={() =>
              setFormData(prev => ({
                ...prev,
                isBlastingPainting: false,
                isSiteDispatch: true
              }))
            }
            className="form-check-input"
          />
          Release for Direct Dispatch
        </label>
      </div>
    </div>
  </div>
)}

              {showSurfaceClearance && (
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block select-gender">
                    <label className="gen-label">
                      Select Procedure <span className="login-danger">*</span>
                    </label>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure_opt"
                          value="mio"
                          checked={formData.isMio}
                          onChange={handleSurfaceRadioChange}
                          className="form-check-input"
                          disabled={data?._id}
                        />{" "}
                        Release for MIO
                      </label>
                    </div>

                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure_opt"
                          value="site_dispatch"
                          checked={formData.isIrn}
                          onChange={handleSurfaceRadioChange}
                          className="form-check-input"
                          disabled={data?._id}
                        />{" "}
                        Release for Site Dispatch
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {showMioClearance && (
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block select-gender">
                    <label className="gen-label">
                      Select Procedure <span className="login-danger">*</span>
                    </label>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure_opt"
                          value="final_coat"
                          checked={formData.isFp}
                          onChange={handleMioRadioChange}
                          className="form-check-input"
                          disabled={data?._id}
                        />{" "}
                        Release for Final Coat
                      </label>
                    </div>

                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure_opt"
                          value="site_dispatch"
                          checked={formData.isIrn}
                          onChange={handleMioRadioChange}
                          className="form-check-input"
                          disabled={data?._id}
                        />{" "}
                        Release for Site Dispatch
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {isRT && (
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="RT Location"
                      value={rtLocationValue || ""}
                      onChange={(e) => handleRtLocationChange(e.target.value)}
                    />
                    {/* NDT Contractor Dropdown */}
                    <select
                      className="form-control"
                      value={contractorId || ""}
                      onChange={(e) => setContractorId(e.target.value)}
                    >
                      <option value="">Select NDT Contractor</option>

                      {ndtContractors?.map((contractor) => (
                        <option key={contractor._id} value={contractor._id}>
                          {contractor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="col-12">
                <div
                  className={
                    is_dispatch
                      ? "d-flex align-items-start justify-content-between doctor-submit"
                      : "doctor-submit text-end"
                  }
                >
                  {is_dispatch && (
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex align-items-center gap-3">
                        <input
                          className="form-control"
                          style={{ width: "250px" }}
                          type="text"
                          value={formData.dispatch_site}
                          name="dispatch_site"
                          placeholder="Dispatch Site"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dispatch_site: e.target.value,
                            })
                          }
                        />

                        <input
                          className="form-control"
                          style={{ width: "250px" }}
                          type="date"
                          name="release_date"
                          max={new Date().toISOString().split("T")[0]} // disables future dates
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              release_date: e.target.value,
                            })
                          }
                        />

                        <select
                          className="form-control form-select"
                          value={formData.paint_system}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paint_system: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Paint System</option>
                          {paintRequirements.map((p) => (
                            <option key={p._id} value={p._id}>
                              {typeof p?.paint_system_no === 'object' ? p?.paint_system_no?.paint_system_no : p?.paint_system_no}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {finalReq?.length === 0 || finalReq === undefined ? (
                    <button
                      type="button"
                      className="btn btn-primary submit-form"
                      onClick={() => handleSubmit(formData)}
                      disabled={disable}
                    >
                      {disable ? "Processing..." : buttonName}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary submit-form"
                      onClick={() => navigate(link)}
                    >
                      Back
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitButton;
