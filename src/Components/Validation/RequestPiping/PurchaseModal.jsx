
const PurchaseModal = ({ itemVal, selectedSup }) => {
    let isValid = true;
    let err = {};

    const validateField = (fieldName, errorMessage) => {
        if (!itemVal[fieldName]) {
            isValid = false;
            err[`${fieldName}_err`] = errorMessage;
        }
    };

    const vlidateLength = (fieldName, errorMessage) => {
        if (!selectedSup.length === 0) {
            isValid = false;
            err[`${fieldName}_err`] = errorMessage;
        }
    }

    // validateField('itemName', 'Please select an item');
    // validateField('quantity', 'Please enter quantity');
    // validateField('store_type', 'Please select store type');
    // vlidateLength('preffered_supplier', 'Please select preffered supplier');
    // validateField('main_supplier', 'Please select supplier');


    return { isValid, err };
}

export default PurchaseModal