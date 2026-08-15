import { ArrowUpFromLine } from 'lucide-react';
import React, { useRef, useState } from 'react';
import ProcessLoader from '../../../../Pages/Users/Include/ProcessLoader';
import toast from 'react-hot-toast';
import axios from 'axios';

const UploadFile = ({ url, importId, onUploadSuccess, requestId, formData, isProject, FIMformData,pipingData }) => {
    const [disable, setDisable] = useState(false);
    const fileInputRef = useRef(null);

    const downloadFile = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
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

        // Append fields BEFORE file
        if (importId) bodyFormData.append("drawingId", importId);
        if (requestId) bodyFormData.append("requestId", requestId);
        if (formData) bodyFormData.append("drawing_id", formData.drawing_id);
        if (FIMformData) bodyFormData.append("fim_packing_id", FIMformData.fim_packing_id);
         if (pipingData) {
            bodyFormData.append("spool_no_id", pipingData.spool_no_id);
            bodyFormData.append("drawing_id", pipingData.drawing_id);
            bodyFormData.append("project_id", pipingData.project_id);
        }
          if (isProject) {
            bodyFormData.append("project", isProject);
        }
        bodyFormData.append("project", String(isProject).trim());

        // Append file LAST
        bodyFormData.append("file", file);

        axios({
            method: "post",
            url: url,
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
            },
        }).then((result) => {
            const { success, data, message } = result.data || {};
            const { errorFile, inserted = 0 } = data || {};
            if (success) {
                if (inserted > 0 && errorFile) {
                    downloadFile(errorFile, 'Import-Errors.xlsx');
                    toast.success('Import completed with some errors. The error file is being downloaded.');
                } else if (inserted > 0) {
                    toast.success(message || 'Imported successfully.');
                } else if (inserted === 0 && errorFile) {
                    downloadFile(errorFile, 'Import-Errors.xlsx');
                    toast.error('No new rows to import. All rows were already imported.');
                } else if (inserted === 0 && !errorFile) {
                    toast.error('No new rows to import.');
                }
                if (onUploadSuccess) onUploadSuccess();
            } else {
                toast.error(message || 'File upload failed.');
            }
        }).catch((error) => {
            toast.error(error?.response?.data?.message || 'File upload failed.');
        }).finally(() => {
            setDisable(false);
            clearFileInput();
        });
    };
 
    const clearFileInput = () => {
        if (fileInputRef.current) fileInputRef.current.value = '';
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
 
 