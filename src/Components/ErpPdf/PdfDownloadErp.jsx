import { V_URL } from '../../BaseUrl';
import toast from 'react-hot-toast';
import axios from 'axios';

export const PdfDownloadErp = ({ apiMethod, url, body, is_admin = false, is_super_admin = false }) => {
    let myurl;
    let token;

    if (is_admin) {
        myurl = `${V_URL}/admin/${url}`;
        token = localStorage.getItem('VA_TOKEN');
    } else if (is_super_admin) {
        myurl = `${V_URL}/super_admin/${url}`;
        token = localStorage.getItem('VE_SUPER_TOKEN');
    } else {
        myurl = `${V_URL}/user/${url}`;
        token = localStorage.getItem('PAY_USER_TOKEN');
    }
    axios({
        method: apiMethod,
        url: myurl,
        data: body,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Bearer " + token },
    }).then((response) => {
        if (response?.data?.success) {
            const fileUrl = response.data.data.file;
            toast.success(response?.data?.message);
            window.open(fileUrl, '_blank');
        } else {
            toast.error(response?.data?.message);
        }
    }).catch((error) => {
        console.error(error);
        toast.error(error?.response?.data?.message || 'Error occurred while downloading the file.');
    });
};