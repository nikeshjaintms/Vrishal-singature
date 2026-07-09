import { ChevronUp } from "lucide-react";
import ScrollToTop from "react-scroll-to-top";

const Top = () => {
    return (
        <div>
            <ScrollToTop
                smooth
                component={<a className="custom-scroll-button"><ChevronUp /></a>}
                style={{ backgroundColor: "#ffe1d0", color: "white" }}
            />
        </div>
    )
}

export default Top
