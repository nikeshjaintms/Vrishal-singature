import { useEffect } from 'react';

const SidebarPath = ({ location, setStoreMenu, setPlanning, setProjectStore,setStockMaterial, setReport, setExecution,
    setExecutionCheck, setNdt, setNdtLotBook, setNdtUt, setNdtRt, setNdtMpt, setNdtLpt, setNdtFt, setNdtPwht, setNdtHt, setNdtPmi, setNdtPickling, setPaintDispatch, setSurfacePrimer, setPainting, setMioPaint, setTopPaint,setStockSurfacePrimer, setStockPainting, setStockMioPaint, setStockTopPaint, setMaterialProcurement }) => {
    useEffect(() => {
        const pathMappings = [
            {
                paths: [
                    '/party/piping-store/category-management',
                    '/party/piping-store/manage-category',
                    '/party/piping-store/unit-management',

                    '/party/piping-store/size-management',
                    '/party/piping-store/manage-size',

                    '/party/piping-store/auth-person-management',
                    '/party/piping-store/piping-class-management',
                    '/party/piping-store/area-management',
                    '/party/piping-store/manage-unit',
                    '/party/piping-store/transport-management',
                    '/party/piping-store/manage-transport',
                    '/party/piping-store/inventory-location-management',
                    '/party/piping-store/manage-inventory-location',
                    '/party/piping-store/party-group-management',
                    '/party/piping-store/manage-party-group',
                    '/party/piping-store/manage-auth-person',
                    '/party/piping-store/final-coat-shade',
                    '/party/piping-store/wps-master-management',
                    '/party/piping-store/manage-wps-master',

                    '/party/piping-store/joint-type-management',
                    '/party/piping-store/manage-joint-type',

                    '/party/piping-store/ndt-master-management',
                    '/party/piping-store/manage-ndt-master',



                    '/party/piping-store/pwht-master-management',
                    '/party/piping-store/manage-pwht-master',

                    '/party/piping-store/hardness-master-management',
                    '/party/piping-store/manage-hardness-master',

                    '/party/piping-store/paint-manufacture-management',
                    '/party/piping-store/manage-paint-manufacture',

                    '/party/piping-store/painting-requirement-management',
                    '/party/piping-store/manage-painting-requirement',

                    '/party/piping-store/painting-system-management',
                    '/party/piping-store/manage-painting-system',

                    '/party/piping-store/welder-management',
                    '/party/piping-store/manage-welder',

                    '/party/piping-store/contractor-master-management',
                    '/party/piping-store/manage-contractor-master',

                    '/party/piping-store/procedure-master-management',
                    '/party/piping-store/manage-procedure-master',

                    '/party/piping-store/wps-master-management',
                    '/party/piping-store/manage-wps-master',

                    '/party/piping-store/project-location-management',
                    '/party/piping-store/manage-project-locationt'
                ],
                action: () => setStoreMenu(true),
            },
            {
                paths: [
                    '/party/piping-store/drawing-management',
                    '/party/piping-store/manage-drawing',
                    '/party/piping-store/drawing-master-data',
                    '/party/piping-store/drawing-joint-master-data',
                    '/party/piping-store/drawing-spool-no-wise-area-inch/meter-master-data',
                    '/party/piping-store/view-drawing',
                ],
                action: () => setPlanning(true),
            },
            {
                paths: [
                    '/party/piping-store/purchase-order-management',
                    '/party/piping-store/manage-purchase-order',
                    '/party/piping-store/purchase-management',
                    '/party/piping-store/sales-order-management',
                    '/party/piping-store/manage-sales-order',

                    '/party/piping-store/verify-request-management',
                    '/party/piping-store/view-qc-request',

                    '/party/piping-store/offer-item-management',
                    '/party/piping-store/view-offered-item',

                    '/party/piping-store/item-request-management',
                    '/party/piping-store/view-item-request',
                    '/party/piping-store/issue-management',
                    '/party/piping-store/manage-issue-request',
                    '/party/piping-store/issue-request-management',

                    '/party/piping-store/create-issue-acceptance',

                    '/party/piping-store/manage-issue-acceptance',
                    '/party/piping-store/issue-acceptance-master-data',
                    '/party/piping-store/verify-request-management',
                    '/party/piping-store/view-qc-request',

                    '/party/piping-store/manage-offer-request',
                    '/party/piping-store/manage-verify-request',

                    '/party/piping-store/stock-report-management',
                    "/party/piping-store/reusable-stock"
                ],
                action: () => setProjectStore(true),
            },
              {
                paths: [

                    '/party/piping-store/stock-wise-issue-request-management',
                    '/party/piping-store/stock-wise-issue-management',
                    '/party/piping-store/manage-stock-wise-issue-request',
                 

                  
                    '/party/piping-store/create-stock-wise-issue-acceptance',
                    '/party/piping-store/manage-stock-wise-issue-acceptance',
                
                    '/party/piping-store/stock-wise-issue-acceptance',
                    "/party/piping-store/stock-issue-acceptance-master-data"

                 
                ],
                action: () => setStockMaterial(true),
            },
            {
                paths: ['/party/piping-store/stock-report'],
                action: () => setReport(true),
            },
            {
                paths: [
                    '/party/piping-store/material-control',
                    '/party/piping-store/procurement-request',
                    '/party/piping-store/inquiry-for-supply',
                    '/party/piping-store/order-placement',
                ],
                action: () => setMaterialProcurement(true),
            },
            {
                paths: [
                    '/party/piping-store/fitup-management',
                    '/party/piping-store/manage-fitup',
                    '/party/piping-store/manage-dpt',
                    '/party/piping-store/dpt-management',
                    '/party/piping-store/weld-visual-management',
                    '/party/piping-store/manage-weld-visual',
                    '/party/piping-store/final-dimension-offer-management',
                    '/party/piping-store/manage-final-dimension-offer'

                ],
                action: () => setExecution(true),
            },
            {
                paths: [
                    '/party/piping-store/fitup-clearance-management',
                    '/party/piping-store/quality-clearance-fitup-management',
                    '/party/piping-store/view-quality-clearance-fitup',

                    '/party/piping-store/dpt-clearance-management',
                    '/party/piping-store/quality-clearance-dpt-management',

                    '/party/piping-store/weld-visual-clearance-management',
                    '/party/piping-store/quality-clearance-weld-visual-management',

                    '/party/piping-store/final-dimension-clearance-management',
                    '/party/piping-store/quality-clearance-final-dimension-management'
                ],
                action: () => setExecutionCheck(true),
            },
            {
                paths: [
                    '/party/piping-store/ndt-management',
                    '/party/piping-store/manage-ndt',

                    '/party/piping-store/ndt-summary',

                    '/party/piping-store/rt-lot-book-management',
                    '/party/piping-store/manage-rt-lot-book-management',

                    '/party/piping-store/mpt-lot-book-management',
                    '/party/piping-store/manage-mpt-lot-book-management',

                    '/party/piping-store/lpt-lot-book-management',
                    '/party/piping-store/manage-lpt-lot-book-management',


                    '/party/piping-store/ut-offer-management',
                    '/party/piping-store/manage-ut-offer',
                    '/party/piping-store/ut-clearance-management',
                    '/party/piping-store/manage-ut-clearance',


                    '/party/piping-store/rt-offer-management',
                    '/party/piping-store/manage-rt-offer',
                    '/party/piping-store/rt-clearance-management',
                    '/party/piping-store/manage-rt-clearance',

                    '/party/piping-store/pwht-offer-management',
                    '/party/piping-store/manage-pwht-offer',
                    '/party/piping-store/pwht-clearance-management',
                    '/party/piping-store/manage-pwht-clearance',

                    '/party/piping-store/ft-offer-management',
                    '/party/piping-store/manage-ft-offer',
                    '/party/piping-store/ft-clearance-management',
                    '/party/piping-store/manage-ft-clearance',

                    '/party/piping-store/mpt-offer-management',
                    '/party/piping-store/manage-mpt-offer',
                    '/party/piping-store/mpt-clearance-management',
                    '/party/piping-store/manage-mpt-clearance',

                    '/party/piping-store/lpt-offer-management',
                    '/party/piping-store/manage-lpt-offer',
                    '/party/piping-store/lpt-clearance-management',
                    '/party/piping-store/manage-lpt-clearance',

                    '/party/piping-store/ht-offer-management',
                    '/party/piping-store/manage-ht-offer',
                    '/party/piping-store/ht-clearance-management',
                    '/party/piping-store/manage-ht-clearance',

                    '/party/piping-store/pmi-offer-management',
                    '/party/piping-store/manage-pmi-offer',
                    '/party/piping-store/pmi-clearance-management',
                    '/party/piping-store/manage-pmi-clearance',

                    '/party/piping-store/pickling-passivation-offer-management',
                    '/party/piping-store/manage-pickling-passivation-offer',
                    '/party/piping-store/pickling-passivation-clearance-management',
                    '/party/piping-store/manage-pickling-passivation-clearance',

                    '/party/piping-store/ndt-percentage',
                ],
                action: () => setNdt(true),
            },
            {
                paths: [
                    '/party/piping-store/ut-offer-management',
                    '/party/piping-store/manage-ut-offer',
                    '/party/piping-store/ut-clearance-management',
                    '/party/piping-store/manage-ut-clearance',
                ],
                action: () => setNdtUt(true),
            },
            {
                paths: [
                    '/party/piping-store/rt-lot-book-management',
                    '/party/piping-store/manage-rt-lot-book-management',
                    '/party/piping-store/lpt-lot-book-management',
                    '/party/piping-store/manage-lpt-lot-book-management',
                    '/party/piping-store/mpt-lot-book-management',
                    '/party/piping-store/manage-mpt-lot-book-management',

                ],
                action: () => setNdtLotBook(true),
            },
            {
                paths: [
                    '/party/piping-store/rt-offer-management',
                    '/party/piping-store/manage-rt-offer',
                    '/party/piping-store/rt-clearance-management',
                    '/party/piping-store/manage-rt-clearance',
                ],
                action: () => setNdtRt(true),
            },
            {
                paths: [
                    '/party/piping-store/mpt-offer-management',
                    '/party/piping-store/manage-mpt-offer',
                    '/party/piping-store/mpt-clearance-management',
                    '/party/piping-store/manage-mpt-clearance',
                ],
                action: () => setNdtMpt(true),
            },
            {
                paths: [
                    '/party/piping-store/lpt-offer-management',
                    '/party/piping-store/manage-lpt-offer',
                    '/party/piping-store/lpt-clearance-management',
                    '/party/piping-store/manage-lpt-clearance',
                ],
                action: () => setNdtLpt(true),
            },

            {
                paths: [
                    '/party/piping-store/ft-offer-management',
                    '/party/piping-store/manage-ft-offer',
                    '/party/piping-store/ft-clearance-management',
                    '/party/piping-store/manage-ft-clearance',
                ],
                action: () => setNdtFt(true),
            },

            {
                paths: [
                    '/party/piping-store/pwht-offer-management',
                    '/party/piping-store/manage-pwht-offer',
                    '/party/piping-store/pwht-clearance-management',
                    '/party/piping-store/manage-pwht-clearance',
                ],
                action: () => setNdtPwht(true),
            },

            {
                paths: [
                    '/party/piping-store/ht-offer-management',
                    '/party/piping-store/manage-ht-offer',
                    '/party/piping-store/ht-clearance-management',
                    '/party/piping-store/manage-ht-clearance',
                ],
                action: () => setNdtHt(true),
            },

            {
                paths: [
                    '/party/piping-store/pmi-offer-management',
                    '/party/piping-store/manage-pmi-offer',
                    '/party/piping-store/pmi-clearance-management',
                    '/party/piping-store/manage-pmi-clearance',
                ],
                action: () => setNdtPmi(true),
            },

            {
                paths: [
                    '/party/piping-store/pickling-passivation-offer-management',
                    '/party/piping-store/manage-pickling-passivation-offer',
                    '/party/piping-store/pickling-passivation-clearance-management',
                    '/party/piping-store/manage-pickling-passivation-clearance',
                ],
                action: () => setNdtPickling(true),
            },
            {
                paths: [
                    '/party/piping-store/inspection-summary-management',
                    '/party/piping-store/view-inspection-summary',
                    '/party/piping-store/view-geninspection-summary',
                    '/party/piping-store/dispatch-note-management',
                    '/party/piping-store/manage-dispatch-note',
                    "/party/piping-store/view-dispatch-note"
                ],
                action: () => setPaintDispatch(true),
            },
            {
                paths: [
                    '/party/piping-store/surface-primer-management',
                    '/party/piping-store/manage-surface-primer',
                    '/party/piping-store/surface-clearance-management',
                    '/party/piping-store/manage-surface-clearance',
                    '/party/piping-store/view-surface-clearance',

                    '/party/piping-store/mio-offer-management',
                    '/party/piping-store/manage-mio-offer',
                    '/party/piping-store/mio-clearance-management',
                    '/party/piping-store/manage-mio-clearance',
                    '/party/piping-store/view-mio-clearance',

                    '/party/piping-store/final-coat-management',
                    '/party/piping-store/manage-final-coat',
                    '/party/piping-store/final-coat-clearance-management',
                    '/party/piping-store/manage-final-coat-clearance',
                    '/party/piping-store/view-final-coat-clearance',
                    '/party/piping-store/final-coat-shade',
                    '/party/piping-store/manage-final-coat-shade',
                ],
                action: () => setPainting(true),
            },
            {
                paths: [
                    '/party/piping-store/surface-primer-management',
                    '/party/piping-store/manage-surface-primer',
                    '/party/piping-store/surface-clearance-management',
                    '/party/piping-store/manage-surface-clearance',
                    '/party/piping-store/view-surface-clearance',
                ],
                action: () => setSurfacePrimer(true),
            },
            {
                paths: [
                    '/party/piping-store/mio-offer-management',
                    '/party/piping-store/manage-mio-offer',
                    '/party/piping-store/mio-clearance-management',
                    '/party/piping-store/manage-mio-clearance',
                    '/party/piping-store/view-mio-clearance',
                ],
                action: () => setMioPaint(true),
            },
            {
                paths: [
                    '/party/piping-store/final-coat-management',
                    '/party/piping-store/manage-final-coat',
                    '/party/piping-store/final-coat-clearance-management',
                    '/party/piping-store/manage-final-coat-clearance',
                    '/party/piping-store/view-final-coat-clearance'
                ],
                action: () => setTopPaint(true),
            },
               {
                paths: [
                    '/party/piping-store/stock-surface-primer-management',
                    '/party/piping-store/manage-stock-surface-primer',
                    '/party/piping-store/stock-surface-clearance-management',
                    '/party/piping-store/manage-stock-surface-clearance',
                    '/party/piping-store/view-stock-surface-clearance',

                    '/party/piping-store/stock-mio-offer-management',
                    '/party/piping-store/manage-stock-mio-offer',
                    '/party/piping-store/stock-mio-clearance-management',
                    '/party/piping-store/manage-stock-mio-clearance',
                    '/party/piping-store/view-stock-mio-clearance',

                    '/party/piping-store/stock-final-coat-management',
                    '/party/piping-store/manage-stock-final-coat',
                    '/party/piping-store/stock-final-coat-clearance-management',
                    '/party/piping-store/manage-stock-final-coat-clearance',
                    '/party/piping-store/view-stock-final-coat-clearance',
                    '/party/piping-store/stock-final-coat-shade',
                    '/party/piping-store/manage-stock-final-coat-shade',
                ],
                action: () => setStockPainting(true),
            },
            {
                paths: [
                    '/party/piping-store/stock-surface-primer-management',
                    '/party/piping-store/manage-stock-surface-primer',
                    '/party/piping-store/stock-surface-clearance-management',
                    '/party/piping-store/manage-stock-surface-clearance',
                    '/party/piping-store/view-stock-surface-clearance',
                ],
                action: () => setStockSurfacePrimer(true),
            },
            {
                paths: [
                    '/party/piping-store/stock-mio-offer-management',
                    '/party/piping-store/manage-stock-mio-offer',
                    '/party/piping-store/stock-mio-clearance-management',
                    '/party/piping-store/manage-stock-mio-clearance',
                    '/party/piping-store/view-stock-mio-clearance',
                ],
                action: () => setStockMioPaint(true),
            },
            {
                paths: [
                    '/party/piping-store/stock-final-coat-management',
                    '/party/piping-store/manage-stock-final-coat',
                    '/party/piping-store/stock-final-coat-clearance-management',
                    '/party/piping-store/manage-stock-final-coat-clearance',
                    '/party/piping-store/view-stock-final-coat-clearance'
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