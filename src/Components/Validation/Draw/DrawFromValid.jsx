
const DrawFromValid = ({ draw }) => {

    let isValid = true;
    let err = {};

    const validateField = (fieldName, errorMessage) => {
        if (!draw[fieldName]) {
            isValid = false;
            err[`${fieldName}_err`] = errorMessage;
        }
    };

    const validateBlankSpace = (fieldName, errorMessage) => {
        if (!draw[fieldName] || !draw[fieldName]?.trim()) {
            isValid = false;
            err[`${fieldName}_err`] = errorMessage;
        }
    };


    validateBlankSpace('drawing_no', 'Please enter drawing no');
    validateField('draw_receive_date', 'Please select drawing receive date');
    validateBlankSpace('unit', 'Please enter unit / area');
    // validateField('rev', 'Please enter rev');
    validateBlankSpace('sheet_no', 'Please enter sheet no.');
    validateBlankSpace('assembly_no', 'Please enter assembly no');
    validateField('assembly_qty', 'Please enter assembly quantity');
    validateBlankSpace('pdf_name', 'Please enter pdf name');
    validateField('pdf_url', 'Please select pdf');
    return { isValid, err };
}

export default DrawFromValid;