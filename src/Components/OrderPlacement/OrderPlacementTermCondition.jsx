import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const OrderPlacementNote = ({
  transactionData,
  handleSave,
  handleDelete,
  handleEdit,
  handleView,
  finalId,
  dataId,
}) => {
  const [terms, setTerms] = useState([{ id: 1, value: "" }]);

  const handleAddInput = () => {
    setTerms([...terms, { id: terms.length + 1, value: "" }]);
  };

  const handleInputChange = (id, newValue) => {
    setTerms(
      terms.map((term) =>
        term.id === id ? { ...term, value: newValue } : term
      )
    );
  };

  const handleRemove = (id) => {
    setTerms(terms.filter((term) => term.id !== id));
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div className="form-heading">
            <h4>Order Placement Term & Condition</h4>
          </div>

          <div className="add-group">
            <button
              type="button"
              className="btn btn-primary add-pluss ms-2"
              data-toggle="tooltip"
              data-placement="top"
              title="Add Order Placement"
              onClick={handleAddInput}
            >
              <img src="/assets/img/icons/plus.svg" alt="add-icon" />
            </button>
          </div>
        </div>

        <div className="row">
          {terms.map((term) => (
            <div
              key={term.id}
              className="col-12 col-md-6 col-xl-6 d-flex align-items-center mb-3"
            >
              <div className="input-block local-forms flex-grow-1">
                <label>{term.id}</label>
                <input
                  className="form-control"
                  type="text"
                  name={`term_condition_${term.id}`}
                  value={term.value}
                  onChange={(e) => handleInputChange(term.id, e.target.value)}
                  placeholder="Enter term & condition"
                />
              </div>
              <button
                type="button"
                className="btn btn-outline-danger ms-2"  style={{ marginTop: "-35px" }}
                onClick={() => handleRemove(term.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderPlacementNote;
