import { ArrowUpFromLine } from 'lucide-react';
import React, { useRef, useState } from 'react';
import ProcessLoader from '../../Pages/Users/Include/ProcessLoader';
import toast from 'react-hot-toast';
import axios from 'axios';

const UploadFile = ({ url, importId, onUploadSuccess, requestId, formData, isProject, pipingData }) => {
    const [disable, setDisable] = useState(false);
    const fileInputRef = useRef(null);

    const uploadFile = (e) => {
        const file = e?.target?.files[0];
        if (!file) {
            toast.error('Please select a file.');
            return;
        }

        const fileType = file.type;
        if (fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            toast.error('Only .xlsx files are allowed.');
            clearFileInput();
            return;
        }

        setDisable(true);
        const bodyFormData = new FormData();
        bodyFormData.append("file", file);
        if (importId) {
            bodyFormData.append("drawingId", importId);
        }
        if (requestId) {
            bodyFormData.append("requestId", requestId);
        }
        if (formData) {
            bodyFormData.append("grid_id", formData.gridId);
            bodyFormData.append("drawing_id", formData.drawId);
        }
        if (isProject) {
            bodyFormData.append("project", isProject);
        }
        if (pipingData) {
            bodyFormData.append("spool_no_id", pipingData.spool_no_id);
            bodyFormData.append("drawing_id", pipingData.drawing_id);
            bodyFormData.append("project_id", pipingData.project_id);
        }

        axios({
            method: "post",
            url: url,
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
            },
        }).then((result) => {
            if (result.data.success) {
                if (result.data.data.file) {
                    const fileUrl = result.data.data.file;
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.setAttribute('download', 'errorFile.xlsx');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                toast.success(result?.data?.message);
                if (onUploadSuccess) onUploadSuccess();
            } else {
                toast.error(result?.data?.message);
            }
        }).catch((error) => {
            toast.error(error?.response?.data?.message || 'File upload failed.');
        }).finally(() => {
            setDisable(false);
            clearFileInput();
        });
    };

    const clearFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <input
                type="file"
                onChange={uploadFile}
                disabled={disable}
                ref={fileInputRef}
                style={{ display: 'none' }}
                id="fileInput"
            />
            <label
                className="btn btn-primary ms-2 p-0 downLoadBtn"
                data-toggle="tooltip"
                data-placement="top"
                title="import"
                htmlFor="fileInput"
                disabled={disable}
            >
                {disable ? <ProcessLoader /> : <ArrowUpFromLine size={16} />}
            </label>
        </>
    );
};

export default UploadFile;
