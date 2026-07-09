import { useEffect } from 'react';

const SidebarPath = ({ location, setStoreMenu, setPlanning, setProjectStore,setStockMaterial, setReport, setExecution,
    setExecutionCheck, setNdt, setNdtLotBook, setNdtUt, setNdtRt, setNdtMpt, setNdtLpt, setNdtFt, setNdtPwht, setNdtHt, setNdtPmi, setNdtPickling, setPaintDispatch, setSurfacePrimer, setPainting, setMioPaint, setTopPaint,setStockSurfacePrimer, setStockPainting, setStockMioPaint, setStockTopPaint, setMaterialProcurement }) => {
    useEffect(() => {
        const pathMappings = [
            {
                paths: [
                    '/piping/user/category-management',
                    '/piping/user/manage-category',
                    '/piping/user/unit-management',

                    '/piping/user/size-management',
                    '/piping/user/manage-size',

                    '/piping/user/auth-person-management',
                    '/piping/user/piping-class-management',
                    '/piping/user/area-management',
                    '/piping/user/manage-unit',
                    '/piping/user/transport-management',
                    '/piping/user/manage-transport',
                    '/piping/user/inventory-location-management',
                    '/piping/user/manage-inventory-location',
                    '/piping/user/party-group-management',
                    '/piping/user/manage-party-group',
                    '/piping/user/manage-auth-person',
                    '/piping/user/final-coat-shade',
                    '/piping/user/wps-master-management',
                    '/piping/user/manage-wps-master',

                    '/piping/user/joint-type-management',
                    '/piping/user/manage-joint-type',

                    '/piping/user/ndt-master-management',
                    '/piping/user/manage-ndt-master',



                    '/piping/user/pwht-master-management',
                    '/piping/user/manage-pwht-master',

                    '/piping/user/hardness-master-management',
                    '/piping/user/manage-hardness-master',

                    '/piping/user/paint-manufacture-management',
                    '/piping/user/manage-paint-manufacture',

                    '/piping/user/painting-requirement-management',
                    '/piping/user/manage-painting-requirement',

                    '/piping/user/painting-system-management',
                    '/piping/user/manage-painting-system',

                    '/piping/user/welder-management',
                    '/piping/user/manage-welder',

                    '/piping/user/contractor-master-management',
                    '/piping/user/manage-contractor-master',

                    '/piping/user/procedure-master-management',
                    '/piping/user/manage-procedure-master',

                    '/piping/user/wps-master-management',
                    '/piping/user/manage-wps-master',

                    '/piping/user/project-location-management',
                    '/piping/user/manage-project-locationt'
                ],
                action: () => setStoreMenu(true),
            },
            {
                paths: [
                    '/piping/user/drawing-management',
                    '/piping/user/manage-drawing',
                    '/piping/user/drawing-master-data',
                    '/piping/user/drawing-joint-master-data',
                    '/piping/user/drawing-spool-no-wise-area-inch/meter-master-data',
                    '/piping/user/view-drawing',
                ],
                action: () => setPlanning(true),
            },
            {
                paths: [
                    '/piping/user/purchase-order-management',
                    '/piping/user/manage-purchase-order',
                    '/piping/user/purchase-management',
                    '/piping/user/sales-order-management',
                    '/piping/user/manage-sales-order',

                    '/piping/user/verify-request-management',
                    '/piping/user/view-qc-request',

                    '/piping/user/offer-item-management',
                    '/piping/user/view-offered-item',

                    '/piping/user/item-request-management',
                    '/piping/user/view-item-request',
                    '/piping/user/issue-management',
                    '/piping/user/manage-issue-request',
                    '/piping/user/issue-request-management',

                    '/piping/user/create-issue-acceptance',

                    '/piping/user/manage-issue-acceptance',
                    '/piping/user/issue-acceptance-master-data',
                    '/piping/user/verify-request-management',
                    '/piping/user/view-qc-request',

                    '/piping/user/manage-offer-request',
                    '/piping/user/manage-verify-request',

                    '/piping/user/stock-report-management',
                    "/piping/user/reusable-stock"
                ],
                action: () => setProjectStore(true),
            },
              {
                paths: [

                    '/piping/user/stock-wise-issue-request-management',
                    '/piping/user/stock-wise-issue-management',
                    '/piping/user/manage-stock-wise-issue-request',
                 

                  
                    '/piping/user/create-stock-wise-issue-acceptance',
                    '/piping/user/manage-stock-wise-issue-acceptance',
                
                    '/piping/user/stock-wise-issue-acceptance',
                    "/piping/user/stock-issue-acceptance-master-data"

                 
                ],
                action: () => setStockMaterial(true),
            },
            {
                paths: ['/piping/user/stock-report'],
                action: () => setReport(true),
            },
            {
                paths: [
                    '/piping/user/material-control',
                    '/piping/user/procurement-request',
                    '/piping/user/inquiry-for-supply',
                    '/piping/user/order-placement',
                ],
                action: () => setMaterialProcurement(true),
            },
            {
                paths: [
                    '/piping/user/fitup-management',
                    '/piping/user/manage-fitup',
                    '/piping/user/manage-dpt',
                    '/piping/user/dpt-management',
                    '/piping/user/weld-visual-management',
                    '/piping/user/manage-weld-visual',
                    '/piping/user/final-dimension-offer-management',
                    '/piping/user/manage-final-dimension-offer'

                ],
                action: () => setExecution(true),
            },
            {
                paths: [
                    '/piping/user/fitup-clearance-management',
                    '/piping/user/quality-clearance-fitup-management',
                    '/piping/user/view-quality-clearance-fitup',

                    '/piping/user/dpt-clearance-management',
                    '/piping/user/quality-clearance-dpt-management',

                    '/piping/user/weld-visual-clearance-management',
                    '/piping/user/quality-clearance-weld-visual-management',

                    '/piping/user/final-dimension-clearance-management',
                    '/piping/user/quality-clearance-final-dimension-management'
                ],
                action: () => setExecutionCheck(true),
            },
            {
                paths: [
                    '/piping/user/ndt-management',
                    '/piping/user/manage-ndt',

                    '/piping/user/ndt-summary',

                    '/piping/user/rt-lot-book-management',
                    '/piping/user/manage-rt-lot-book-management',

                    '/piping/user/mpt-lot-book-management',
                    '/piping/user/manage-mpt-lot-book-management',

                    '/piping/user/lpt-lot-book-management',
                    '/piping/user/manage-lpt-lot-book-management',


                    '/piping/user/ut-offer-management',
                    '/piping/user/manage-ut-offer',
                    '/piping/user/ut-clearance-management',
                    '/piping/user/manage-ut-clearance',


                    '/piping/user/rt-offer-management',
                    '/piping/user/manage-rt-offer',
                    '/piping/user/rt-clearance-management',
                    '/piping/user/manage-rt-clearance',

                    '/piping/user/pwht-offer-management',
                    '/piping/user/manage-pwht-offer',
                    '/piping/user/pwht-clearance-management',
                    '/piping/user/manage-pwht-clearance',

                    '/piping/user/ft-offer-management',
                    '/piping/user/manage-ft-offer',
                    '/piping/user/ft-clearance-management',
                    '/piping/user/manage-ft-clearance',

                    '/piping/user/mpt-offer-management',
                    '/piping/user/manage-mpt-offer',
                    '/piping/user/mpt-clearance-management',
                    '/piping/user/manage-mpt-clearance',

                    '/piping/user/lpt-offer-management',
                    '/piping/user/manage-lpt-offer',
                    '/piping/user/lpt-clearance-management',
                    '/piping/user/manage-lpt-clearance',

                    '/piping/user/ht-offer-management',
                    '/piping/user/manage-ht-offer',
                    '/piping/user/ht-clearance-management',
                    '/piping/user/manage-ht-clearance',

                    '/piping/user/pmi-offer-management',
                    '/piping/user/manage-pmi-offer',
                    '/piping/user/pmi-clearance-management',
                    '/piping/user/manage-pmi-clearance',

                    '/piping/user/pickling-passivation-offer-management',
                    '/piping/user/manage-pickling-passivation-offer',
                    '/piping/user/pickling-passivation-clearance-management',
                    '/piping/user/manage-pickling-passivation-clearance',

                    '/piping/user/ndt-percentage',
                ],
                action: () => setNdt(true),
            },
            {
                paths: [
                    '/piping/user/ut-offer-management',
                    '/piping/user/manage-ut-offer',
                    '/piping/user/ut-clearance-management',
                    '/piping/user/manage-ut-clearance',
                ],
                action: () => setNdtUt(true),
            },
            {
                paths: [
                    '/piping/user/rt-lot-book-management',
                    '/piping/user/manage-rt-lot-book-management',
                    '/piping/user/lpt-lot-book-management',
                    '/piping/user/manage-lpt-lot-book-management',
                    '/piping/user/mpt-lot-book-management',
                    '/piping/user/manage-mpt-lot-book-management',

                ],
                action: () => setNdtLotBook(true),
            },
            {
                paths: [
                    '/piping/user/rt-offer-management',
                    '/piping/user/manage-rt-offer',
                    '/piping/user/rt-clearance-management',
                    '/piping/user/manage-rt-clearance',
                ],
                action: () => setNdtRt(true),
            },
            {
                paths: [
                    '/piping/user/mpt-offer-management',
                    '/piping/user/manage-mpt-offer',
                    '/piping/user/mpt-clearance-management',
                    '/piping/user/manage-mpt-clearance',
                ],
                action: () => setNdtMpt(true),
            },
            {
                paths: [
                    '/piping/user/lpt-offer-management',
                    '/piping/user/manage-lpt-offer',
                    '/piping/user/lpt-clearance-management',
                    '/piping/user/manage-lpt-clearance',
                ],
                action: () => setNdtLpt(true),
            },

            {
                paths: [
                    '/piping/user/ft-offer-management',
                    '/piping/user/manage-ft-offer',
                    '/piping/user/ft-clearance-management',
                    '/piping/user/manage-ft-clearance',
                ],
                action: () => setNdtFt(true),
            },

            {
                paths: [
                    '/piping/user/pwht-offer-management',
                    '/piping/user/manage-pwht-offer',
                    '/piping/user/pwht-clearance-management',
                    '/piping/user/manage-pwht-clearance',
                ],
                action: () => setNdtPwht(true),
            },

            {
                paths: [
                    '/piping/user/ht-offer-management',
                    '/piping/user/manage-ht-offer',
                    '/piping/user/ht-clearance-management',
                    '/piping/user/manage-ht-clearance',
                ],
                action: () => setNdtHt(true),
            },

            {
                paths: [
                    '/piping/user/pmi-offer-management',
                    '/piping/user/manage-pmi-offer',
                    '/piping/user/pmi-clearance-management',
                    '/piping/user/manage-pmi-clearance',
                ],
                action: () => setNdtPmi(true),
            },

            {
                paths: [
                    '/piping/user/pickling-passivation-offer-management',
                    '/piping/user/manage-pickling-passivation-offer',
                    '/piping/user/pickling-passivation-clearance-management',
                    '/piping/user/manage-pickling-passivation-clearance',
                ],
                action: () => setNdtPickling(true),
            },
            {
                paths: [
                    '/piping/user/inspection-summary-management',
                    '/piping/user/view-inspection-summary',
                    '/piping/user/view-geninspection-summary',
                    '/piping/user/dispatch-note-management',
                    '/piping/user/manage-dispatch-note',
                    "/piping/user/view-dispatch-note"
                ],
                action: () => setPaintDispatch(true),
            },
            {
                paths: [
                    '/piping/user/surface-primer-management',
                    '/piping/user/manage-surface-primer',
                    '/piping/user/surface-clearance-management',
                    '/piping/user/manage-surface-clearance',
                    '/piping/user/view-surface-clearance',

                    '/piping/user/mio-offer-management',
                    '/piping/user/manage-mio-offer',
                    '/piping/user/mio-clearance-management',
                    '/piping/user/manage-mio-clearance',
                    '/piping/user/view-mio-clearance',

                    '/piping/user/final-coat-management',
                    '/piping/user/manage-final-coat',
                    '/piping/user/final-coat-clearance-management',
                    '/piping/user/manage-final-coat-clearance',
                    '/piping/user/view-final-coat-clearance',
                    '/piping/user/final-coat-shade',
                    '/piping/user/manage-final-coat-shade',
                ],
                action: () => setPainting(true),
            },
            {
                paths: [
                    '/piping/user/surface-primer-management',
                    '/piping/user/manage-surface-primer',
                    '/piping/user/surface-clearance-management',
                    '/piping/user/manage-surface-clearance',
                    '/piping/user/view-surface-clearance',
                ],
                action: () => setSurfacePrimer(true),
            },
            {
                paths: [
                    '/piping/user/mio-offer-management',
                    '/piping/user/manage-mio-offer',
                    '/piping/user/mio-clearance-management',
                    '/piping/user/manage-mio-clearance',
                    '/piping/user/view-mio-clearance',
                ],
                action: () => setMioPaint(true),
            },
            {
                paths: [
                    '/piping/user/final-coat-management',
                    '/piping/user/manage-final-coat',
                    '/piping/user/final-coat-clearance-management',
                    '/piping/user/manage-final-coat-clearance',
                    '/piping/user/view-final-coat-clearance'
                ],
                action: () => setTopPaint(true),
            },
               {
                paths: [
                    '/piping/user/stock-surface-primer-management',
                    '/piping/user/manage-stock-surface-primer',
                    '/piping/user/stock-surface-clearance-management',
                    '/piping/user/manage-stock-surface-clearance',
                    '/piping/user/view-stock-surface-clearance',

                    '/piping/user/stock-mio-offer-management',
                    '/piping/user/manage-stock-mio-offer',
                    '/piping/user/stock-mio-clearance-management',
                    '/piping/user/manage-stock-mio-clearance',
                    '/piping/user/view-stock-mio-clearance',

                    '/piping/user/stock-final-coat-management',
                    '/piping/user/manage-stock-final-coat',
                    '/piping/user/stock-final-coat-clearance-management',
                    '/piping/user/manage-stock-final-coat-clearance',
                    '/piping/user/view-stock-final-coat-clearance',
                    '/piping/user/stock-final-coat-shade',
                    '/piping/user/manage-stock-final-coat-shade',
                ],
                action: () => setStockPainting(true),
            },
            {
                paths: [
                    '/piping/user/stock-surface-primer-management',
                    '/piping/user/manage-stock-surface-primer',
                    '/piping/user/stock-surface-clearance-management',
                    '/piping/user/manage-stock-surface-clearance',
                    '/piping/user/view-stock-surface-clearance',
                ],
                action: () => setStockSurfacePrimer(true),
            },
            {
                paths: [
                    '/piping/user/stock-mio-offer-management',
                    '/piping/user/manage-stock-mio-offer',
                    '/piping/user/stock-mio-clearance-management',
                    '/piping/user/manage-stock-mio-clearance',
                    '/piping/user/view-stock-mio-clearance',
                ],
                action: () => setStockMioPaint(true),
            },
            {
                paths: [
                    '/piping/user/stock-final-coat-management',
                    '/piping/user/manage-stock-final-coat',
                    '/piping/user/stock-final-coat-clearance-management',
                    '/piping/user/manage-stock-final-coat-clearance',
                    '/piping/user/view-stock-final-coat-clearance'
                ],
                action: () => setStockTopPaint(true),
            },
        ];

        pathMappings.forEach(({ paths, action }) => {
            if (paths?.includes(location.pathname)) {
                action();
            }
        });
    }, [location.pathname, setStoreMenu, setPlanning, setProjectStore,setStockMaterial, setReport, setExecution, setMaterialProcurement,
        setNdt, setNdtLotBook, setNdtUt, setNdtRt, setNdtMpt, setNdtLpt, setNdtFt, setNdtPwht, setNdtHt, setNdtPmi, setNdtPickling, setPaintDispatch, setSurfacePrimer, setPainting, setMioPaint, setTopPaint,setStockSurfacePrimer, setStockPainting, setStockMioPaint, setStockTopPaint,]);

    return null;
}

export default SidebarPath;