import React, { useEffect, useMemo } from 'react'
import { useState } from 'react'
import DrawHeader from './DrawHeader';
import DrawingTable from '../../Components/DrawingTable/DrawingTable';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { useDispatch, useSelector } from 'react-redux';
import { getMultiNdtOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import { getUserNdtMaster } from '../../../../../Store/Store/Ndt/NdtMaster';
import NdtTypeModel from './NdtTypeModel';

const NdtOfferCheck = () => {

  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('')
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [table, setTable] = useState([]);
  const [disable, setDisable] = useState(true);
  const [ndtType, setNdtType] = useState(null);
  const [isModel, setIsModel] = useState(false);
  const [finalArray, setFinalArray] = useState([]);

  useEffect(() => {
    dispatch(getUserNdtMaster({ status: true })).then((response) => {
      const ndtData = response.payload?.data;
      const findNdt = ndtData?.find((nt) => nt?.name === 'RT');
      if (findNdt && disable) {
        dispatch(getMultiNdtOffer({ status: '', type: findNdt._id }));
        setDisable(false);
      }
    }).catch((error) => console.error("Error fetching NDT Master data:", error));
  }, [disable]);

  useEffect(() => {
    dispatch(getDrawing());
  }, []);

  const entity = useSelector((state) => state.getMultiNdtOffer?.user?.data);
  const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);

  useEffect(() => {
    const filterEntity = entity?.filter((e) => e?.status === 1);
    const drawingIds = filterEntity?.flatMap(entry =>
      entry.items?.map(item => item.drawing_id)
    );
    const uniqueDrawingIds = [...new Set(drawingIds)];
    const filterDrawing = drawData?.filter((dr) => uniqueDrawingIds.includes(dr?._id));
    setTable(filterDrawing);
  }, [entity, drawData])

  const commentsData = useMemo(() => {
    let computedComments = table;
    if (search) {
      computedComments = computedComments.filter(
        (rt) =>
          rt.ndt_master_id?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
          rt.ndt_master_id?.report_no?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [entity, limit, search, table]);

  const handleAddToArr = (id) => {
    setIsModel(true);
    setNdtType(id);
  }

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table show-entire">
            <div className="card-body">

              <DrawingTable
                tableTitle={'RT Drawing List'}
                commentsData={commentsData}
                handleAddToIssueArr={handleAddToArr}
                currentPage={currentPage}
                limit={limit}
                setlimit={setLimit}
                totalItems={totalItems}
                setCurrentPage={setCurrentPage}
                setSearch={setSearch}
              // data={data}
              />


            </div>
          </div>
        </div>
      </div>

      <NdtTypeModel
        isModel={isModel}
        handleCloseModal={() => setIsModel(false)}
        title={'Drawing Grid List'}
        entity={entity}
        ndtType={ndtType}
        setFinalArray={setFinalArray}
      />
    </>
  )
}

export default NdtOfferCheck