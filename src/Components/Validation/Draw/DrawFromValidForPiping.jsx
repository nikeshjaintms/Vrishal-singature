
const DrawFromValidForPiping = ({ draw }) => {
console.log("Draw object for validation:", draw); // 👈 add this line
    let isValid = true;
    let err = {};

    const validateField = (fieldName, errorMessage) => {
        if (!draw[fieldName]) {
            isValid = false;
            err[`${fieldName}_err`] = errorMessage;
        }
    };

    const validateBlankSpace = (fieldName, errorMessage) => {
        // if (!draw[fieldName] || !draw[fieldName]?.trim())
            if (!draw[fieldName] || !draw[fieldName]?.trim())

            {
            isValid = false;
            err[`${fieldName}_err`] = errorMessage;
        }
    };


    validateBlankSpace('drawing_no', 'Please enter drawing no');
    validateField('drawing_receive_date', 'Please select drawing receive date');
    validateBlankSpace('area_unit', 'Please enter unit / area');
    validateField('piping_class', 'Please select piping class');
     validateBlankSpace('p_id_drawing_no', 'Please select P & Id Drawing No');
      validateBlankSpace('drawing_received_lot_no', 'Please select Drawing Received Lot No');
    // validateField('rev', 'Please enter rev');
    // validateBlankSpace('sheet_no', 'Please enter sheet no.');
    // validateBlankSpace('assembly_no', 'Please enter assembly no');
    // validateField('assembly_qty', 'Please enter assembly quantity');
    validateBlankSpace('pdf_name', 'Please enter pdf name');
    validateField('pdf_url', 'Please select pdf');
     console.log("Validation debug:", { isValid, err, draw }); // 👈 add this line
    return { isValid, err };
}

export default DrawFromValidForPiping;