import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProcessLoader from '../../../../Pages/Piping/Include/ProcessLoader';
import { ArrowDownToLine } from 'lucide-react';

const DownloadFormat = ({ url, fileName }) => {

    const [disable, setDisable] = useState(false);
    const downloadFile = () => {
        setDisable(true)
        axios({
            method: "get",
            url: url,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response?.data?.success === true) {
                const fileUrl = response.data.data.file;
                const link = document.createElement('a');
                link.href = fileUrl;
                link.setAttribute('download', `${fileName}.xlsx`);
                document.body.appendChild(link);
                link.click();
                toast.success(response?.data.message);
            }
            setDisable(false)
        }).catch((error) => {
            console.log(error, '!!');
            toast.error(error?.response?.data.message);
            setDisable(false)
        })
    }
    return (
        <button
            className="btn btn-primary ms-2 p-0 downLoadBtn"
            type='button'
            onClick={downloadFile}
            data-toggle="tooltip" data-placement="top" title="download format"
            disabled={disable}
        >
            {disable ? <ProcessLoader /> : <ArrowDownToLine size={16} />}
        </button>
    )
}

export default DownloadFormat