import React from "react";

const Pagination = ({ postsperpage, totalposts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalposts / postsperpage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav>
      <ul
        className="pagination"
        style={{ overflowX: "auto", cursor: "pointer" }}
      >
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
