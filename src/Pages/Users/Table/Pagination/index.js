import React, { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";

const PaginationComponent = ({
  total = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
}) => {
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (total > 0 && itemsPerPage > 0) setTotalPages(Math.ceil(total / itemsPerPage));
  }, [total, itemsPerPage]);

  const PageList = () => {
    var data = [];
    let tempCurrentPage = currentPage;
    if (tempCurrentPage > totalPages) {
      tempCurrentPage = totalPages;
      onPageChange(tempCurrentPage);
    }
    var start =
      tempCurrentPage === 1
        ? tempCurrentPage
        : tempCurrentPage === 2
          ? tempCurrentPage - 1
          : tempCurrentPage - 2;
    var end =
      totalPages === tempCurrentPage
        ? tempCurrentPage
        : totalPages - 1 === tempCurrentPage
          ? tempCurrentPage + 1
          : tempCurrentPage + 2;
    for (var i = start; i <= end; i++) {
      data.push(i);
    }
    return (
      <>
        {data.map((e, i) => {
          return (
            <Pagination.Item
              key={e}
              active={e === tempCurrentPage}
              onClick={() => onPageChange(e)}
            >
              {e}
            </Pagination.Item>
          );
        })}
      </>
    );
  };

  if (totalPages === 0) return null;

  return (
    <div>
      <Pagination>
        <Pagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >

          Previous
        </Pagination.Prev>
        <PageList />
        <Pagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next

        </Pagination.Next>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
