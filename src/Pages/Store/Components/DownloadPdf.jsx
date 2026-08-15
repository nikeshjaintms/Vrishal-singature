import axios from "axios";
import { V_URL } from "../../../BaseUrl";
import toast from "react-hot-toast";

export const DownloadPdf = ({ apiMethod, url, body, is_admin = false }) => {
    let myurl
    let token
    if (is_admin) {
        myurl = `${V_URL}/admin/${url}`;
    } else {
        myurl = `${V_URL}/user/${url}`;
    }
    if (is_admin) {
        token = localStorage.getItem('VA_TOKEN');
    } else {
        token = localStorage.getItem('PAY_USER_TOKEN');
    }

    axios({
        method: apiMethod,
        data: body,
        url: myurl,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + token },
    }).then((response) => {
        if (response?.data?.success === true) {
            if (response.data.data.jobId) {
                const jobId = response.data.data.jobId;
                toast.loading("Generating report in background...", { id: jobId });

                const eventSource = new EventSource(`${V_URL}/user/report-stream/${jobId}`);

                eventSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.status === "completed") {
                        window.open(data.fileUrl, '_blank');
                        toast.success("Report ready! Downloading...", { id: jobId });
                        eventSource.close();
                    } else if (data.status === "failed") {
                        toast.error("Report generation failed: " + data.error, { id: jobId });
                        eventSource.close();
                    }
                };

                eventSource.onerror = (err) => {
                    console.error("SSE Error:", err);
                    eventSource.close();
                };
            } else {
                const fileUrl = response.data.data.file;
                window.open(fileUrl, '_blank');
                toast.success(response?.data.message);
            }
        } else {
            toast.error(response?.data.message);
        }
    }).catch((error) => {
        toast.error(error?.response?.data.message);
    })
}