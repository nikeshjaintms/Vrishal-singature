

const PurchaseForm = ({ request }) => {
    let isValid = true;
    let err = {};

    const validateField = (fieldName, errorMessage) => {
        if (!request[fieldName]) {
            isValid = false;
            err[`${fieldName}_err`] = errorMessage;
        }
    };

    // validateField('project', 'Please select project');
    validateField('requestDate', 'Please select request date');
    validateField('storeLocation', 'Please select project location');
    validateField('department', 'Please select department');
    validateField('material_po', 'Please enter material po number');
    // validateField('drawing_id', 'Please select drawing no');

    return { isValid, err };
}

export default PurchaseForm
