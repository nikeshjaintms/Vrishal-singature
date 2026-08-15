import React from 'react'
import { V_URL } from '../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const PDFDownload = ({ method, url, payload, is_admin = false }) => {
    let tokan
    if (is_admin) {
        tokan = localStorage.getItem("VA_TOKEN")
    } else {
        tokan = localStorage.getItem("PAY_USER_TOKEN")
    }
    const myurl = `${V_URL}${url}`;
    axios({
        method: method,
        url: myurl,
        data: payload,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Barrer " + tokan,
        },
    }).then((response) => {
        if (response.data.success === true) {
            toast.success(response?.data?.message);
            window.open(response.data.data.file, '_blank')
        } else {
            toast.error(response?.data?.message);
        }
    })
        .catch((error) => {
            toast.error("Something went wrong");
        });
    return (
        <>

        </>
    )
}

export default PDFDownload