import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';

const GeneralPaint = ({
  title,
  fields,
  conditionalFields,
  scrollableTabs,
  onSave, // Callback to save data in the parent
}) => {

  const [tabData, setTabData] = useState({});

  const handleInputChange = (e, fieldName) => {
    setTabData(prevState => ({
      ...prevState,
      [fieldName]: e.target.value,
    }));
  };

  const handleSave = (tabIndex) => {
    onSave(tabData, tabIndex);
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-body">
            <form>
              <div className="col-12">
                <h4>{title}</h4>
              </div>
              <div className="row">
                {fields.map((field, index) => (
                  <div key={index} className={`col-12 ${field.colClasses}`}>
                    <div className="input-block local-forms custom-select-wpr">
                      <label>{field.label} <span className="login-danger">*</span></label>
                      
                        <input
                          type={field.type}
                          className='form-control'
                          onChange={(e) => handleInputChange(e, field.name)}
                        />
                      
                    </div>
                  </div>
                ))}
              </div>
              <div className="row">
                <TabView>
                  {scrollableTabs.map((tab, tabIndex) => (
                    <TabPanel key={tab.title} header={tab.title}>
                      <div className='row'>
                        {conditionalFields.map((field, index) => (
                          <div key={index} className={`col-md-${field.colMd}`}>
                            <div className="input-block local-forms mt-2">
                              <label>{field.label} <span className="login-danger">*</span></label>
                              <input
                                className='form-control'
                                type={field.type}
                                onChange={(e) => handleInputChange(e, field.name)}
                              />
                            </div>
                          </div>
                        ))}
                        <div className='col-md-4 doctor-submit'>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleSave(tabIndex)}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </TabPanel>
                  ))}
                </TabView>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralPaint;

