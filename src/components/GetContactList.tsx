import React, { useEffect, useState, useRef } from "react";
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import { LOAD_CONTACT_LIST } from "../GraphQL/Queries";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { FaRegStar, FaStar } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import Pagination from "./Pagination";
import { EditContact } from "./EditContact";
import { validate } from "graphql";
import classNames from "classnames";

const CardContainer = styled.div`
  padding: 15px;
  border-bottom: 1px solid grey;
  border-top: 1px solid grey;
  flex: 1;
  display: flex;
`;
const Favorite = styled.div`
  padding: 15px;
  border: 0px;
  margin: 10px 0px;
  flex: 1;
  display: flex;
`;

const ProfilePicture = styled.div`
  background-color: grey;
  height: 4em;
  width: 4em;
  border-radius: 4em;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 30;
`;

const Name = styled.p`
  flex: 1;
  align-items: center;
  font-size: 20px;
  margin: 0px;
  font-weight: bold;
  justify-content: center;
`;
const Number = styled.p`
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0px;
  font-size: 15px;
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

function GetContactList() {
  // initialization
  const { error, loading, data } = useQuery(LOAD_CONTACT_LIST);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const resetUser = () => {
    if (data) {
      const sorted = [...data.contact].sort((a, b) =>
        a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : -1
      );
      setUsers(sorted);
      setFilteredUsers(sorted);
    }
  };
  useEffect(() => {
    resetUser();
  }, [data]);

  //favorite contact
  const [favID, setfavID] = useState(null);
  const [favContact, setFavContact] = useState<any>(null);
  const removeItem = (id: number) => {
    setFilteredUsers(users.filter((item) => id !== item.id));
  };
  const resetRecords = () => {
    resetUser();
  };

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredUsers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const nPages = Math.ceil(filteredUsers.length / recordsPerPage);

  //edit contact
  const modalRef = useRef<any>();

  //search contact
  const [searchInput, setSearchInput] = useState("");
  const handleChange = (e: any) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    setFilteredUsers(
      users.filter((x) => {
        const name = `${x.first_name}${x.last_name}`;
        if (
          name
            .toLowerCase()
            .includes(e.target.value.replace(/ /g, "").toLowerCase())
        ) {
          return true;
        }

        return false;
      })
    );
  };

  return (
    <div>
      <input
        type="search"
        placeholder="Search contact"
        onChange={handleChange}
        value={searchInput}
        className={css`
          width: 90%;
          padding: 8px;
          font-size: 15px;
          margin-left: 20px;
          border-radius: 10px;
        `}
      />
      {favContact ? (
        <Favorite onClick={() => modalRef.current.open(favContact)}>
          <ProfilePicture>{favContact.first_name[0]}</ProfilePicture>
          <Info>
            <Name>
              {favContact.first_name} {favContact.last_name}
            </Name>
            <Number>{favContact.phones[0].number}</Number>
          </Info>
          <FaStar
            style={{
              fontSize: "30px",
              height: "5vh",
            }}
            onClick={(e) => {
              setfavID(null);
              setFavContact(null);
              resetRecords();
              e.stopPropagation();
            }}
          />
        </Favorite>
      ) : (
        <Favorite
          className={css`
            height: 10px;
          `}
        />
      )}
      {currentRecords.map((val) => {
        return val.id === favID ? (
          ""
        ) : (
          <div key={val.id}>
            <CardContainer onClick={() => modalRef.current.open(val)}>
              <ProfilePicture>{val.first_name[0]}</ProfilePicture>
              <Info>
                <Name>
                  {val.first_name} {val.last_name}
                </Name>
                <Number>{val.phones[0].number}</Number>
              </Info>

              <FaRegStar
                style={{
                  fontSize: "30px",
                  height: "5vh",
                  padding: "5px",
                }}
                onClick={(e) => {
                  setfavID(val.id);
                  setFavContact(val);
                  removeItem(val.id);
                  e.stopPropagation();
                }}
              />
            </CardContainer>
            <EditContact ref={modalRef} />
          </div>
        );
      })}
      <Pagination
        nPages={nPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default GetContactList;
