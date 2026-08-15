import { useEffect } from 'react';

const SidebarPath = ({ location, setStoreMenu, setPlanning, setProjectStore, setReport, setExecution,
    setExecutionCheck, setNdt, setNdtUt, setNdtRt, setNdtMpt, setNdtLpt, setPaintDispatch, setSurfacePrimer, setPainting, setMioPaint, setTopPaint }) => {
    useEffect(() => {
        const pathMappings = [
            {
                paths: [
                    '/user/project-store/category-management',
                    '/user/project-store/manage-category',
                    '/user/project-store/unit-management',
                    '/user/project-store/auth-person-management',
                    '/user/project-store/manage-unit',
                    '/user/project-store/transport-management',
                    '/user/project-store/manage-transport',
                    '/user/project-store/inventory-location-management',
                    '/user/project-store/manage-inventory-location',
                    '/user/project-store/party-group-management',
                    '/user/project-store/manage-party-group',
                    '/user/project-store/manage-auth-person',

                    '/user/project-store/wps-master-management',
                    '/user/project-store/manage-wps-master',

                    '/user/project-store/joint-type-management',
                    '/user/project-store/manage-joint-type',

                    '/user/project-store/ndt-master-management',
                    '/user/project-store/manage-ndt-master',

                    '/user/project-store/paint-manufacture-management',
                    '/user/project-store/manage-paint-manufacture',

                    '/user/project-store/painting-system-management',
                    '/user/project-store/manage-painting-system',

                    '/user/project-store/welder-management',
                    '/user/project-store/manage-welder',

                    '/user/project-store/contractor-master-management',
                    '/user/project-store/manage-contractor-master',

                    '/user/project-store/procedure-master-management',
                    '/user/project-store/manage-procedure-master',

                    '/user/project-store/wps-master-management',
                    '/user/project-store/manage-wps-master',

                    '/user/project-store/project-location-management',
                    '/user/project-store/manage-project-locationt'
                ],
                action: () => setStoreMenu(true),
            },
            {
                paths: [
                    '/user/project-store/drawing-management',
                    '/user/project-store/manage-drawing',
                    '/user/project-store/view-drawing',
                ],
                action: () => setPlanning(true),
            },
            {
                paths: [
                    '/user/project-store/purchase-order-management',
                    '/user/project-store/manage-purchase-order',
                    '/user/project-store/purchase-management',
                    '/user/project-store/sales-order-management',
                    '/user/project-store/manage-sales-order',

                    '/user/project-store/verify-request-management',
                    '/user/project-store/view-qc-request',

                    '/user/project-store/offer-item-management',
                    '/user/project-store/view-offered-item',

                    '/user/project-store/item-request-management',
                    '/user/project-store/view-item-request',
                    '/user/project-store/issue-management',
                    '/user/project-store/manage-issue-request',
                    '/user/project-store/issue-request-management',

                    '/user/project-store/create-issue-acceptance',

                    '/user/project-store/manage-issue-acceptance',
                    '/user/project-store/verify-request-management',
                    '/user/project-store/view-qc-request',

                    '/user/project-store/manage-offer-request',
                    '/user/project-store/manage-verify-request',

                    '/user/project-store/stock-report-management',
                    "/user/project-store/reusable-stock"
                ],
                action: () => setProjectStore(true),
            },
            {
                paths: ['/user/project-store/stock-report'],
                action: () => setReport(true),
            },
            {
                paths: [
                    '/user/project-store/fitup-management',
                    '/user/project-store/manage-fitup',
                    '/user/project-store/weld-visual-management',
                    '/user/project-store/manage-weld-visual',
                    '/user/project-store/final-dimension-offer-management',
                    '/user/project-store/manage-final-dimension-offer'

                ],
                action: () => setExecution(true),
            },
            {
                paths: [
                    '/user/project-store/fitup-clearance-management',
                    '/user/project-store/quality-clearance-fitup-management',
                    '/user/project-store/view-quality-clearance-fitup',

                    '/user/project-store/weld-visual-clearance-management',
                    '/user/project-store/quality-clearance-weld-visual-management',

                    '/user/project-store/final-dimension-clearance-management',
                    '/user/project-store/quality-clearance-final-dimension-management'
                ],
                action: () => setExecutionCheck(true),
            },
            {
                paths: [
                    '/user/project-store/ndt-management',
                    '/user/project-store/manage-ndt',

                    '/user/project-store/ut-offer-management',
                    '/user/project-store/manage-ut-offer',
                    '/user/project-store/ut-clearance-management',
                    '/user/project-store/manage-ut-clearance',

                    '/user/project-store/rt-offer-management',
                    '/user/project-store/manage-rt-offer',
                    '/user/project-store/rt-clearance-management',
                    '/user/project-store/manage-rt-clearance',

                    '/user/project-store/mpt-offer-management',
                    '/user/project-store/manage-mpt-offer',
                    '/user/project-store/mpt-clearance-management',
                    '/user/project-store/manage-mpt-clearance',

                    '/user/project-store/lpt-offer-management',
                    '/user/project-store/manage-lpt-offer',
                    '/user/project-store/lpt-clearance-management',
                    '/user/project-store/manage-lpt-clearance',
                ],
                action: () => setNdt(true),
            },
            {
                paths: [
                    '/user/project-store/ut-offer-management',
                    '/user/project-store/manage-ut-offer',
                    '/user/project-store/ut-clearance-management',
                    '/user/project-store/manage-ut-clearance',
                ],
                action: () => setNdtUt(true),
            },
            {
                paths: [
                    '/user/project-store/rt-offer-management',
                    '/user/project-store/manage-rt-offer',
                    '/user/project-store/rt-clearance-management',
                    '/user/project-store/manage-rt-clearance',
                ],
                action: () => setNdtRt(true),
            },
            {
                paths: [
                    '/user/project-store/mpt-offer-management',
                    '/user/project-store/manage-mpt-offer',
                    '/user/project-store/mpt-clearance-management',
                    '/user/project-store/manage-mpt-clearance',
                ],
                action: () => setNdtMpt(true),
            },
            {
                paths: [
                    '/user/project-store/lpt-offer-management',
                    '/user/project-store/manage-lpt-offer',
                    '/user/project-store/lpt-clearance-management',
                    '/user/project-store/manage-lpt-clearance',
                ],
                action: () => setNdtLpt(true),
            },
            {
                paths: [
                    '/user/project-store/inspection-summary-management',
                    '/user/project-store/view-inspection-summary',
                    '/user/project-store/view-geninspection-summary',
                    '/user/project-store/dispatch-note-management',
                    '/user/project-store/manage-dispatch-note',
                    "/user/project-store/view-dispatch-note"
                ],
                action: () => setPaintDispatch(true),
            },
            {
                paths: [
                    '/user/project-store/surface-primer-management',
                    '/user/project-store/manage-surface-primer',
                    '/user/project-store/surface-clearance-management',
                    '/user/project-store/manage-surface-clearance',
                    '/user/project-store/view-surface-clearance',

                    '/user/project-store/mio-offer-management',
                    '/user/project-store/manage-mio-offer',
                    '/user/project-store/mio-clearance-management',
                    '/user/project-store/manage-mio-clearance',
                    '/user/project-store/view-mio-clearance',

                    '/user/project-store/final-coat-management',
                    '/user/project-store/manage-final-coat',
                    '/user/project-store/final-coat-clearance-management',
                    '/user/project-store/manage-final-coat-clearance',
                    '/user/project-store/view-final-coat-clearance'
                ],
                action: () => setPainting(true),
            },
            {
                paths: [
                    '/user/project-store/surface-primer-management',
                    '/user/project-store/manage-surface-primer',
                    '/user/project-store/surface-clearance-management',
                    '/user/project-store/manage-surface-clearance',
                    '/user/project-store/view-surface-clearance',
                ],
                action: () => setSurfacePrimer(true),
            },
            {
                paths: [
                    '/user/project-store/mio-offer-management',
                    '/user/project-store/manage-mio-offer',
                    '/user/project-store/mio-clearance-management',
                    '/user/project-store/manage-mio-clearance',
                    '/user/project-store/view-mio-clearance',
                ],
                action: () => setMioPaint(true),
            },
            {
                paths: [
                    '/user/project-store/final-coat-management',
                    '/user/project-store/manage-final-coat',
                    '/user/project-store/final-coat-clearance-management',
                    '/user/project-store/manage-final-coat-clearance',
                    '/user/project-store/view-final-coat-clearance'
                ],
                action: () => setTopPaint(true),
            }
        ];

        pathMappings.forEach(({ paths, action }) => {
            if (paths?.includes(location.pathname)) {
                action();
            }
        });
    }, [location.pathname, setStoreMenu, setPlanning, setProjectStore, setReport, setExecution,
        setNdt, setNdtUt, setNdtRt, setNdtMpt, setNdtLpt, setPaintDispatch, setSurfacePrimer, setPainting, setMioPaint, setTopPaint]);

    return null;
}

export default SidebarPath;