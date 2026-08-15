import React, { useEffect, useState } from 'react'
import DashboardCard from '../../Users/Dashboard/components/DashoboardCard';
import axios from 'axios';
import { V_URL } from '../../../BaseUrl';

const PmsDashboard = ({ pId }) => {

    const [pmsData, setPmsData] = useState([])

    useEffect(() => {
        if (pId) {
            getPmsDaashboard();
        }
    }, [pId]);

    const getPmsDaashboard = () => {
        const myUrl = `${V_URL}/admin/get-pms-dashboard`;
        const formdata = new URLSearchParams()
        formdata.append("project", pId)
        axios({
            method: "POST",
            url: myUrl,
            data: formdata,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Barrer " + localStorage.getItem("VA_TOKEN"),
            },
        }).then((res) => {
            const { data, success } = res?.data;
            if (success) {
                setPmsData(data);
            }
        }).catch((error) => {
            console.log(error, 'error')
        })
    }

    const cardData = [
        { title: "DRAWING ENTRY", lastDay: pmsData?.lastDayCount, overall: pmsData?.overallCount, icon: "/assets/img/icons/calendar.svg" },
        { title: "MATERIAL ISSUED", lastDay: pmsData?.lastDayMultiplyIssQty, overall: pmsData?.overallMultiplyIssQty, icon: "/assets/img/icons/calendar.svg" },
        { title: "FIT-UP ACCEPTANCE", lastDay: pmsData?.lastDayFitup, overall: pmsData?.overallFitup, icon: "/assets/img/icons/calendar.svg" },
        { title: "WELD VISUAL ACCEPTANCE", lastDay: pmsData?.lastDayWeldVisual, overall: pmsData?.overallWeldVisual, icon: "/assets/img/icons/calendar.svg" },
        { title: "NDT ACCEPTANCE", lastDay: pmsData?.lastDayNdt, overall: pmsData?.overallNdt, icon: "/assets/img/icons/calendar.svg" },
        { title: "FD ACCEPTANCE", lastDay: pmsData?.lastDayFd, overall: pmsData?.overallFd, icon: "/assets/img/icons/calendar.svg" },
        { title: "DISPATCH NOTE FOR PAITING (KG)", lastDay: pmsData?.lastDayDn, overall: pmsData?.overallDn, icon: "/assets/img/icons/calendar.svg" },
        { title: "DISPATCH NOTE FOR PAITING (SQM)", lastDay: pmsData?.lastDayDnAsm, overall: pmsData?.overallDnAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "SURFACE PREPARATION & PRIMER (KG)", lastDay: pmsData?.lastDaySurface, overall: pmsData?.overallSurface, icon: "/assets/img/icons/calendar.svg" },
        { title: "SURFACE PREPARATION & PRIMER (SQM)", lastDay: pmsData?.lastDaySurfaceAsm, overall: pmsData?.overallSurfaceAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "MIO PAINT (KG)", lastDay: pmsData?.lastDayMio, overall: pmsData?.overallMio, icon: "/assets/img/icons/calendar.svg" },
        { title: "MIO PAINT (SQM)", lastDay: pmsData?.lastDayMioAsm, overall: pmsData?.overallMioAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "Final PAINT (KG)", lastDay: pmsData?.lastDayFinalCoat, overall: pmsData?.overallFinalCoat, icon: "/assets/img/icons/calendar.svg" },
        { title: "Final PAINT (SQM)", lastDay: pmsData?.lastDayFinalCoatAsm, overall: pmsData?.overallFinalCoatAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "DISPATCH PACKING LIST (KG)", lastDay: pmsData?.lastDayPacking, overall: pmsData?.overallPacking, icon: "/assets/img/icons/calendar.svg" },
        // { title: "Packing ASM", lastDay: pmsData?.lastDayPackingAsm, overall: pmsData?.overallPackingAsm, icon: "/assets/img/icons/calendar.svg" },
    ];

    return (
        <>
            <div className="row">
                {pmsData &&
                    cardData.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
            </div>
        </>
    )
}

export default PmsDashboard