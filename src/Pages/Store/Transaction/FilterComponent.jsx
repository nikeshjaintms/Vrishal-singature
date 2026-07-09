import React from "react";
import { Collapse } from "react-bootstrap";

const FilterComponent = ({
  itemLedger,
  handleDateChange,
  handleDownloadPdf,
  handleDownloadXlsx,
  openFilter,
  isPurchaseSummary
}) => {
  return (
    <>
      <Collapse in={openFilter}>
        <div className="row my-4">
          <div className="col-12 col-md-3">
            <div className="input-block local-forms mb-0">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => handleDateChange(e, 'start')}
              />
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="input-block local-forms mb-0">
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => handleDateChange(e, 'end')}
              />
            </div>
          </div>

          <div className={`col-12 col-md-6 add-group justify-content-end ${itemLedger ? "d-none" : ""}`}>
            <div className="d-flex gap-2">
              <button
                className="w-100 btn btn-primary h-100"
                type="button"
                onClick={handleDownloadPdf}
              >
                PDF <i className="fa-solid fa-download mx-2"></i>
              </button>

              {/* {!isPurchaseSummary && ( */}
                <button
                  className="w-100 btn btn-primary h-100"
                  type="button"
                  onClick={handleDownloadXlsx}
                >
                  XLSX <i className="fa-solid fa-download mx-2"></i>
                </button>
              {/* )} */}
            </div>
          </div>
        </div>
      </Collapse >
    </>
  );
};

export default FilterComponent;
