import React from "react";

const StatusBadge = ({ status }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 1:
                return "custom-badge status-orange";
            case 2:
                return "custom-badge status-blue";
            case 3:
                return "custom-badge status-green";
            default:
                return "-";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1:
                return "Pending";
            case 2:
                return "Offered";
            case 3:
                return "Completed";
            default:
                return "-";
        }
    };

    return (
        <span className={getStatusClass(status)}>
            {getStatusText(status)}
        </span>
    );
};

export default StatusBadge;
