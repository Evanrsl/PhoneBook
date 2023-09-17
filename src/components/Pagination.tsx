import React from "react";
import { css } from "@emotion/css";
import styled from "@emotion/styled";

const Link = styled.a`
  list-style-type: none;
  text-decoration: none;
  color: inherit;
`;

const TD = styled.td`
  list-style-type: none;
  text-decoration: none;
  color: inherit;
  border: 1px solid black;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const Pagination = ({
  nPages,
  currentPage,
  setCurrentPage,
}: {
  nPages: number;
  currentPage: any;
  setCurrentPage: any;
}) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  return (
    <nav>
      <table
        className={css`
          border: 1px solid black;
          border-collapse: collapse;
          margin: 20px auto;
        `}
      >
        <tbody>
          <tr
            className={css`
              border: 1px solid black;
            `}
          >
            <TD>
              <Link onClick={prevPage} href="#">
                Previous
              </Link>
            </TD>
            {pageNumbers.map((pgNumber) => (
              <TD
                key={pgNumber}
                className={css`
                  ${currentPage == pgNumber
                    ? "background-color: lightblue"
                    : ""}
                `}
              >
                <Link onClick={() => setCurrentPage(pgNumber)} href="#">
                  {pgNumber}
                </Link>
              </TD>
            ))}
            <TD>
              <Link onClick={nextPage} href="#">
                Next
              </Link>
            </TD>
          </tr>
        </tbody>
      </table>
    </nav>
  );
};

export default Pagination;
