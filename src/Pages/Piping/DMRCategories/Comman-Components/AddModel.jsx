import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const AddModel = ({ modalOpen, handleModalClose, handleAddCategory, modalMode, categoryData }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Pre-populate form when editing
  useEffect(() => {
    if (modalMode === "edit" && categoryData) {
      setName(categoryData.name || '');
    } else {
      setName('');
    }
    setError('');
  }, [modalMode, categoryData, modalOpen]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    // Call the parent function to save the category
    if (handleAddCategory) {
      handleAddCategory({ name: name.trim() });
    }
    
    setError('');
    setName(''); // Clear the input after saving
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
    setError('');
  };

  const handleClose = () => {
    setName(''); // Clear the input when closing
    setError('');
    handleModalClose();
  };

  const getModalTitle = () => {
    return modalMode === "edit" ? "Edit Category" : "Add Category";
  };

  const getSaveButtonText = () => {
    return modalMode === "edit" ? "Update" : "Save";
  };

  return (
    <Modal show={modalOpen} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{getModalTitle()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="categoryName">Name<span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            value={name}
            onChange={handleInputChange}
            placeholder="Enter category name"
          />
          {error && <div className="text-danger mt-1">{error}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          {getSaveButtonText()}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddModel;