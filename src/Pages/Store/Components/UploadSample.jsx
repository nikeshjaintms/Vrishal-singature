import axios from "axios";
import { V_URL } from "../../../BaseUrl";
import toast from "react-hot-toast";

export const UploadXlsx = ({ apiMethod, url, body, onSuccess }) => {
    const myurl = `${V_URL}/user/${url}`;
    axios({
        method: apiMethod,
        data: body,
        url: myurl,
        headers: { "Content-Type": "multipart/form-data", Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') },
    }).then((response) => {
        if (response?.data?.success === true) {
            toast.success(response?.data.message);
            if (onSuccess) onSuccess();
        } else {
            toast.error(response?.data.message);
        }
    }).catch((error) => {
        toast.error(error?.response?.data.message);
    })
}