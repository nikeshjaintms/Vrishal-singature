import axios from "axios";
import { V_URL } from "../../../BaseUrl";
import toast from "react-hot-toast";

export const DownloadXlsx = ({ apiMethod, url, body, fileName }) => {
    const myurl = `${V_URL}/user/${url}`;
    axios({
        method: apiMethod,
        data: body,
        url: myurl,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
    }).then((response) => {
        if (response?.data?.success === true) {
            if (response.data.data.jobId) {
                const jobId = response.data.data.jobId;
                toast.loading("Generating Excel report in background...", { id: jobId });

                const eventSource = new EventSource(`${V_URL}/user/report-stream/${jobId}`);

                eventSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.status === "completed") {
                        const link = document.createElement('a');
                        link.href = data.fileUrl;
                        link.setAttribute('download', `${fileName}.xlsx`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        toast.success("Excel report ready! Downloading...", { id: jobId });
                        eventSource.close();
                    } else if (data.status === "failed") {
                        toast.error("Excel generation failed: " + data.error, { id: jobId });
                        eventSource.close();
                    }
                };

                eventSource.onerror = (err) => {
                    console.error("SSE Error:", err);
                    eventSource.close();
                };
            } else {
                const fileUrl = response.data.data.file;
                const link = document.createElement('a');
                link.href = fileUrl;
                link.setAttribute('download', `${fileName}.xlsx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success(response?.data.message);
            }
        } else {
            toast.error(response?.data.message);
        }
    }).catch((error) => {
        console.log(error, '!!');
        toast.error(error?.response?.data.message);
    })
}