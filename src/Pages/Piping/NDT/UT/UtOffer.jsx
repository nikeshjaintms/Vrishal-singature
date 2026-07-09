import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import NdtOfferHeader from '../../../../Components/NDT/NdtOfferHeader';
import NdtOfferTable from '../../../../Components/NDT/NdtOfferTable';
import { getUserNdtOffer } from '../../../../Store/Store/Ndt/NdtOffer';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import { getUserNdtMaster } from '../../../../Store/Store/Ndt/NdtMaster';

const UtOffer = () => {

    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        dispatch(getUserNdtMaster({ status: '' }))
            .then((response) => {
                const ndtData = response.payload?.data;
                const findNdt = ndtData?.find((nt) => nt?.name === 'UT');
                if (findNdt && disable) {
                    dispatch(getUserNdtOffer({ status: '', type: findNdt._id }));
                    setDisable(false);
                }
            }).catch((error) => console.error("Error fetching NDT Master data:", error));
    }, [dispatch, disable]);

    const entity = useSelector((state) => state.getUserNdtOffer?.user?.data);

    const commentsData = useMemo(() => {
        const projectId = localStorage.getItem('U_PROJECT_ID');
        let computedComments = entity;
        if (computedComments) {
            computedComments = computedComments?.filter(o =>
                o?.items?.some(item =>
                    item?.transaction_id?.drawingId?.project?._id === projectId
                ));
        }
        if (search) {
            computedComments = computedComments.filter(
                (ut) =>
                    ut.name?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const handleDownloadOffer = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('ndt_offer_no', elem.ndt_offer_no);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'one-ndt-offer-download', body: bodyFormData });
    }

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">

                    <NdtOfferHeader name={'Ultrasonic Test Offer List'} />

                    {disable === false ? (
                        <NdtOfferTable
                            name={'Ultrasonic Test Offer List'}
                            url={'/piping/user/manage-ut-offer'}
                            commentsData={commentsData}
                            limit={limit}
                            setlimit={setlimit}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalItems={totalItems}
                            setSearch={setSearch}
                            handleRefresh={handleRefresh}
                            handleDownloadOffer={handleDownloadOffer}
                        />
                    ) : <Loader />}

                </div>
                <Footer />
            </div>
        </div>
    )
}

export default UtOffer