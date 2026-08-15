const IssueForm = ({ issue }) => {
    var isValid = true;
    let err = {};
    const validateField = (fieldName, errorMessage) => {
        if (!issue[fieldName]) {
            isValid = false;
            err[`${fieldName}_err`] = errorMessage;
        }
    };

    const validateName = (fieldName, errorMessage) => {
        if (!issue[fieldName] || !issue[fieldName]?.trim()) {
            isValid = false;
            err[`${fieldName}_err`] = errorMessage;
        }
    }

    validateName('contractor_name', 'Please enter contractor name');
    validateField('date', 'Please select date');
    validateField('issue_length', 'Please enter issue date');
    validateField('heat_no', 'Please enter heat no.');

    return { isValid, err };
}

export default IssueForm