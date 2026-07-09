import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAdminDraw } from '../../../../../Store/Erp/Planner/Draw/UserAdminDraw';


export const useDrawDetails = (drawId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserAdminDraw());
    }, [dispatch]);

    const drawData = useSelector((state) => state?.getUserAdminDraw?.user?.data);

    return drawData?.find((dr) => dr?._id === drawId);
};

