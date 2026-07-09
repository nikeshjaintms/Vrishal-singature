import React from "react";
import CountUp from "react-countup";

const DashboardCard = ({ title, lastDay, overall, icon }) => {
    return (
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="dash-widget">
                <div className="dash-boxs comman-flex-center">
                    <img src={icon} alt={title} />
                </div>
                <div className="dash-content dash-count">
                    <h4>{title}</h4>
                    <h5 style={{ fontSize: "15px" }}>Last Day: <CountUp end={lastDay || 0} /></h5>
                    <h5 style={{ fontSize: "15px" }}>Overall: <CountUp end={overall || 0} /></h5>
                </div>
            </div>
        </div>
    );
};

export default DashboardCard;
