import React from 'react'

const PaintingSystemValid = (paint) => {

    let isValid = true;
    let err = {};

    const validateField = (fieldName, errorMessage) => {
        if (!paint[fieldName] || !paint[fieldName]?.trim()) {
            isValid = false;
            err[`${fieldName}_err`] = errorMessage;
        }
    };

    validateField('paint_system_no', 'Please enter paint system no.');
    validateField('surface', 'Please enter surface preparation standard');
    validateField('profile', 'Please enter profile requirements');
    validateField('sailTest', 'Please enter sail test requirements');
    validateField('paintManu', 'Please enter paint manufacturer');
    // validateField('primerPaint', 'Please enter primer paint / shade');
    // validateField('primerApp', 'Please enter primer application method');
    // validateField('primerDft', 'Please enter primer dft range');
    // validateField('mioPaint', 'Please enter mio paint / shade');
    // validateField('mioApp', 'Please enter mio application method');
    // validateField('mioDft', 'Please enter mio dft range');
    // validateField('finalPaint', 'Please enter final paint / shade');
    // validateField('finalPaintApp', 'Please enter final paint application method');
    // validateField('finalPaintDft', 'Please enter final paint dft method');
    validateField('totalDft', 'Please enter total dft requirements')

    return { isValid, err }
}

export default PaintingSystemValid