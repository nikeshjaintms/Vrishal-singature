import { getMultiDrawingItems } from "../Store/MutipleDrawing/MultipleDrawing/GetMultiGridItems";
import { getMultiGrids } from "../Store/MutipleDrawing/MultipleDrawing/GetMultiGrids";

// Issue Request =====================================
export const checkItemsDrawings = async (drIds, dispatch, entity) => {
  const result = await getGridItems(drIds, dispatch);

  const { data, success } = result;
  if (!success) {
    return { matchData: [], unmatchData: [] };
  }

  const validDrawingIds = new Set(
    data?.filter((item) => item.balance_grid > 0).map((item) => item.drawing_id)
  );

  const matchData = entity.filter((item) => validDrawingIds.has(item._id));
  const unmatchData = entity.filter((item) => !validDrawingIds.has(item._id));

  return { matchData, unmatchData };
};

export const checkFitupDrawing = (entity) => {
  let unmatched = [];
  let matched = [];
  if (entity?.length > 0) {
    entity.forEach((record) => {
      let isUnmatched = record.items.every((item) => {
        // Ensure both values exist and are numbers
        const usedQty = item.iss_used_grid_qty || 0;
        const movedQty = item.moved_next_step || 0;
        return usedQty - movedQty !== 0;
      });
      if (isUnmatched) {
        matched.push(record);
      } else {
        unmatched.push(record);
      }
    });
  }
  return { matched, unmatched };
};

// Final Dimension ===================================

// export const checkFdDrawingGrid = (entity) => {
//   const matchedData = [];
//   const unmatchedData = [];

//   if (entity?.ndt?.length > 0 || entity?.issueAcceptance?.length > 0) {
//     const allData = [...(entity.ndt || []), ...(entity.issueAcceptance || [])];

//     allData.forEach((drawing) => {
//       let hasMatched = false;
//       let hasUnmatched = false;

//       drawing.items.forEach((item) => {
//         const usedQty = item.ndt_used_grid_qty ?? item.iss_used_grid_qty ?? 0;
//         const movedQty = item.moved_next_step ?? 0;
//         const diff = usedQty - movedQty;

//         if (diff > 0) {
//           hasMatched = true;
//         } else if (diff === 0) {
//           hasUnmatched = true;
//         }
//       });

//       if (hasMatched) {
//         matchedData.push(drawing);
//       } else if (hasUnmatched) {
//         unmatchedData.push(drawing);
//       }
//     });
//   }

//   return { matchData: matchedData, unmatchData: unmatchedData };
// };

export const checkFdDrawingGrid = (entity) => {
  const matchedData = [];
  const unmatchedData = [];

  if (entity?.ndt?.length > 0 || entity?.issueAcceptance?.length > 0) {
    const allData = [...(entity.ndt || []), ...(entity.issueAcceptance || [])];

    allData.forEach((drawing) => {
      let hasMatched = false;
      let hasUnmatched = false;

      drawing.items?.forEach((item) => {
        const usedQty = item.ndt_used_grid_qty ?? item.iss_used_grid_qty ?? 0;
        const movedQty = item.moved_next_step ?? 0;
        const diff = usedQty - movedQty;

        if (diff > 0) {
          hasMatched = true; // means this drawing has pending movement
        } else if (diff === 0) {
          hasUnmatched = true; // means it is fully moved
        }
      });

      if (hasMatched) {
        matchedData.push(drawing);
      } else if (hasUnmatched) {
        unmatchedData.push(drawing);
      }
    });
  }

  return { matchData: matchedData, unmatchData: unmatchedData };
}; 


//Disaptch Note =====================================


export const checkDispatchNote = async (entity) => {
  const matchedData = [];
  const unmatchedData = [];

  if (entity?.length > 0) {
    entity?.forEach((drawing) => {
      let hasMatched = false;
      let hasUnmatched = false;

      drawing.items.forEach((item) => {
        const diff = item.is_grid_qty - item.moved_next_step;
        if (diff > 0) {
          hasMatched = true;
        } else if (diff === 0) {
          hasUnmatched = true;
        }
      });

      if (hasMatched) {
        matchedData.push(drawing);
      } else if (hasUnmatched) {
        unmatchedData.push(drawing);
      }
    });
  }
  return { matchData: matchedData, unmatchData: unmatchedData };
};

// Surface =====================================
export const checkSurfacePaint = (entity) => {
  const matchedData = [];
  const unmatchedData = [];
  if (entity?.length > 0) {
    entity?.forEach((drawing) => {
      let hasMatched = false;
      let hasUnmatched = false;

      drawing.items.forEach((item) => {
        const diff = item.dn_grid_qty - item.dn_move_qty;
        if (diff > 0) {
          hasMatched = true;
        } else if (diff === 0) {
          hasUnmatched = true;
        }
      });
      if (hasMatched) {
        matchedData.push(drawing);
      } else if (hasUnmatched) {
        unmatchedData.push(drawing);
      }
    });
  }

  return {
    matchData: matchedData,
    unmatchData: unmatchedData,
  };
};

// Mio =====================================
export const checkMioPaint = (entity) => {
  const matchedData = [];
  const unmatchedData = [];
  console.log("Enitiy", entity);

  if (entity?.length > 0) {
    entity?.forEach((drawing) => {
      let hasMatched = false;
      let hasUnmatched = false;

      drawing.items.forEach((item) => {
        console.log("item",item);
        const diff = item.surface_used_grid_qty - item.moved_next_step;
        // const diff = 2;
        // console.log(diff);
        if (diff > 0) {
          hasMatched = true;
        } else if (diff === 0) {
          hasUnmatched = true;
        }
      });
      if (hasMatched) {
        // console.log("Matching",drawing);
        matchedData.push(drawing);
      } else if (hasUnmatched) {
        // console.log("UnWatching",drawing);
        unmatchedData.push(drawing);
      }
    });
  }

  return {
    matchData: matchedData,
    unmatchData: unmatchedData,
  };
};

// Final Coat =====================================
export const checkFinalCoatPaint = (entity) => {
  const matchedData = [];
  const unmatchedData = [];

  if (entity?.length > 0) {
    entity?.forEach((drawing) => {
      let hasMatched = false;
      let hasUnmatched = false;

      drawing.items.forEach((item) => {
        const diff = item.mio_used_grid_qty - item.moved_next_step;
        if (diff > 0) {
          hasMatched = true;
        } else if (diff === 0) {
          hasUnmatched = true;
        }
      });
      if (hasMatched) {
        matchedData.push(drawing);
      } else if (hasUnmatched) {
        unmatchedData.push(drawing);
      }
    });
  }

  return {
    matchData: matchedData,
    unmatchData: unmatchedData,
  };
};

export const checkPacking = (entity) => {
  const matchedData = [];
  const unmatchedData = [];
  if (entity?.length > 0) {
    entity?.forEach((drawing) => {
      let hasMatched = false;
      let hasUnmatched = false;

      drawing.items.forEach((item) => {
        const diff = item.is_grid_qty - item.moved_next_step;
        if (diff > 0) {
          hasMatched = true;
        } else if (diff === 0) {
          hasUnmatched = true;
        }
      });
      if (hasMatched) {
        matchedData.push(drawing);
      } else if (hasUnmatched) {
        unmatchedData.push(drawing);
      }
    });
  }

  return {
    matchData: matchedData,
    unmatchData: unmatchedData,
  };
};

// API calling  =================================
export const getGridItems = (ids, dispatch) => {
  return dispatch(getMultiDrawingItems(ids))
    .then((res) => {
      console.log(res);
      const { data, message, success } = res.payload;
      if (success) {
        return { data, success };
      } else {
        return { data: [], success: false };
      }
    })
    .catch((err) => {
      console.error(err);
      return { data: [], success: false };
    });
};

export const getGridsDraw = (drawIds, dispatch) => {
  return dispatch(getMultiGrids(drawIds))
    .then((res) => {
      console.log(res);
      const { data, message, success } = res.payload;
      if (success) {
        return { data, success };
      } else {
        return { data: [], success: false };
      }
    })
    .catch((err) => {
      console.error(err);
      return { data: [], success: false };
    });
};
