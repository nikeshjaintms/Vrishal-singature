import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getDmrCategories } from '../../../../Store/Erp/DmrCategories/DmrCategories';
import { manageDmr } from '../../../../Store/Erp/Dmr/Dmr';
import moment from 'moment';

const AddModel = ({ modalOpen, handleModalClose, handleAddDmr, modalMode, dmrData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    project: '',
    date: '',
    categories: {}
  });
  const [error, setError] = useState('');

  // Get DMR categories from store
  const dmrCategories = useSelector((state) => state.dmr?.categories || []);
  const loading = useSelector((state) => state.dmr?.loading || false);

  // Pre-populate form when editing
  useEffect(() => {
    if (modalMode === "edit" && dmrData) {
      const categoriesData = {};
      if (dmrData.daily_mandays && dmrData.category) {
        // For edit mode, populate the specific category that was edited
        categoriesData[dmrData.category] = dmrData.daily_mandays[0]?.value || '';
      }

      setFormData({
        project: dmrData.project?._id || dmrData.project || '',
        date: dmrData.daily_mandays?.[0]?.date ? moment(dmrData.daily_mandays[0].date).format('YYYY-MM-DD') : '',
        categories: categoriesData
      });
    } else {
      setFormData({
        project: localStorage.getItem('U_PROJECT_ID') || '',
        date: moment().format('YYYY-MM-DD'),
        categories: {}
      });
    }
    setError('');
  }, [modalMode, dmrData, modalOpen]);

  // Fetch DMR categories when modal opens
  useEffect(() => {
    if (modalOpen) {
      dispatch(getDmrCategories());
    }
  }, [modalOpen, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleCategoryChange = (categoryId, value) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: value
      }
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.project) {
      setError('Project is required');
      return false;
    }
    if (!formData.date) {
      setError('Date is required');
      return false;
    }

    // Validate date range (2 days ago to today)
    const selectedDate = moment(formData.date);
    const today = moment();
    const twoDaysAgo = moment().subtract(2, 'days');

    if (selectedDate.isAfter(today, 'day')) {
      setError('Cannot select future dates. Please select today or a past date.');
      return false;
    }

    if (selectedDate.isBefore(twoDaysAgo, 'day')) {
      setError('Cannot select dates more than 2 days in the past. Please select a date from 2 days ago to today.');
      return false;
    }

    // Check if ALL categories have values
    const allCategoriesHaveValues = dmrCategories.every(category => {
      const value = formData.categories[category._id];
      return value !== '';
    });

    if (!allCategoriesHaveValues) {
      setError('Please enter mandays for ALL categories. All fields are required.');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Convert categories object to array format for the API
    const categoriesArray = Object.entries(formData.categories)
      .filter(([_, value]) => value !== '' && !isNaN(parseFloat(value)))
      .map(([categoryId, value]) => ({
        category: categoryId,
        value: parseFloat(value)
      }));

    const submitData = {
      ...formData,
      categories: categoriesArray
    };

    // Call the parent function to save the DMR
    if (handleAddDmr) {
      handleAddDmr(submitData);
    }

    setError('');
    setFormData({
      project: localStorage.getItem('U_PROJECT_ID') || '',
      date: moment().format('YYYY-MM-DD'),
      categories: {}
    });
  };

  const handleClose = () => {
    setFormData({
      project: localStorage.getItem('U_PROJECT_ID') || '',
      date: moment().format('YYYY-MM-DD'),
      categories: {}
    });
    setError('');
    handleModalClose();
  };

  const getModalTitle = () => {
    return modalMode === "edit" ? "Edit DMR Entry" : "Add DMR Entry";
  };

  const getSaveButtonText = () => {
    return modalMode === "edit" ? "Update" : "Save";
  };

  // Calculate total mandays
  const totalMandays = Object.values(formData.categories)
    .filter(value => value !== '' && !isNaN(parseFloat(value)))
    .reduce((sum, value) => sum + parseFloat(value || 0), 0);

  // Check if all categories have values
  const allCategoriesHaveValues = dmrCategories.every(category => {
    const value = formData.categories[category._id];
    return value !== '' && !isNaN(parseFloat(value));
  });

  // Calculate min and max dates for validation
  const today = moment().format('YYYY-MM-DD');
  const twoDaysAgo = moment().subtract(2, 'days').format('YYYY-MM-DD');

  return (
    <Modal show={modalOpen} onHide={handleClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{getModalTitle()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row mb-3">
          <input
            type="hidden"
            className="form-control"
            id="project"
            name="project"
            value={formData.project}
            onChange={handleInputChange}
            placeholder="Project ID"
            disabled
          />
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="date">Date<span style={{ color: 'red' }}>*</span></label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                min={twoDaysAgo}
                max={today}
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              <small className="text-muted">
                You can select dates from {twoDaysAgo} to {today}
              </small>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12">
            <h6 className="text-primary mb-3">Enter Mandays for Each Category</h6>
            <div className="alert alert-info mb-3">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Note:</strong> All categories are mandatory. Please enter mandays values for each category.
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    <th style={{ width: '60%' }}>Category<span style={{ color: 'red' }}>*</span></th>
                    <th style={{ width: '35' }}>Mandays<span style={{ color: 'red' }}>*</span></th>
                  </tr>
                </thead>
                <tbody>
                  {dmrCategories.map((category, index) => (
                    <tr key={category._id}>
                      <td className="text-center fw-bold">{index + 1}</td>
                      <td>
                        <p >
                          {category.name}
                        </p>
                      </td>
                      <td>
                        <input
                          type="number"
                          className={`form-control`}
                          value={formData.categories[category._id] ?? ''}
                          onChange={(e) => handleCategoryChange(category._id, e.target.value)}
                          placeholder="Enter mandays"
                          min="0"
                          step="0.01"
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Section */}
            {/* {allCategoriesHaveValues && (
              <div className="mt-3">
                <h6 className="text-success">Summary</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-title">Categories with Values</h6>
                        <ul className="list-unstyled">
                          {Object.entries(formData.categories)
                            .filter(([_, value]) => value !== '' && parseFloat(value) > 0)
                            .map(([categoryId, value]) => {
                              const category = dmrCategories.find(cat => cat._id === categoryId);
                              return (
                                <li key={categoryId} className="mb-2">
                                  <p>
                                    {category ? category.name : 'Unknown'}
                                  </p>
                                  <span className="fw-bold">{parseFloat(value).toFixed(2)} mandays</span>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-warning text-dark">
                      <div className="card-body text-center">
                        <h5 className="card-title">Total Mandays</h5>
                        <h2 className="display-6 fw-bold">{totalMandays.toFixed(2)}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>

        {error && <div className="text-danger mt-3">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : getSaveButtonText()}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddModel;
