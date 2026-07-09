export const statusProcedure = (status) => {
    switch (status) {
        case 1:
            return "Submmited";
        case 2:
            return "Approved";
        case 3:
            return "Commented";
        case 4:
            return "Superseded";
        case 5:
            return "Reviewed";
        case 6:
            return "Rejected";
    }
}