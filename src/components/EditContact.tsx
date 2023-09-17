import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { useQuery, gql } from "@apollo/client";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { motion, AnimatePresence } from "framer-motion";
import { DELETE_CONTACT } from "../GraphQL/Mutations";
import { useMutation } from "@apollo/client";

const ProfilePicture = styled.div`
  background-color: grey;
  height: 2em;
  width: 2em;
  border-radius: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 30px;
  margin-left: auto;
  margin-right: auto;
`;
const Name = styled.p`
  flex: 1;
  align-items: center;
  font-size: 30px;
  margin: 15px;
  font-weight: bold;
  justify-content: center;
`;
const Number = styled.p`
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0px;
  font-size: 20px;
`;
interface User {
  first_name: string;
  last_name: string;
  id: number;
  phones: any;
  number: string;
}
interface Phone {
  number: string;
}

export const EditContact = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User>();

  function getContact(user: User) {
    setOpen(true);
    setUsers(user);
  }

  useImperativeHandle(ref, () => {
    return {
      open: (user: User) => getContact(user),
      close: () => setOpen(false),
    };
  });
  const [delete_contact_by_pk, { error }] = useMutation(DELETE_CONTACT);
  const deleteContact = (deletedID: number) => {
    delete_contact_by_pk({
      variables: {
        id: deletedID,
      },
    });

    if (error) {
      console.log(error);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.3,
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                delay: 0.3,
              },
            }}
            onClick={() => setOpen(false)}
            className={css`
              position: fixed;
              height: 100vh;
              width: 100vw;
              top: 0;
              left: 0;
              background: rgba(0, 0, 0, 0.6);
            `}
          ></motion.div>
          <motion.div
            initial={{
              y: 700,
            }}
            animate={{
              y: 0,

              transition: {
                duration: 0.3,
              },
            }}
            exit={{
              y: 700,
              transition: {
                delay: 0.3,
              },
            }}
            className={css`
              position: fixed;

              width: 90vw;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              margin: auto;
              padding: 10px;
              background: white;
              border-radius: 10px;
              margin-top: 10vh;
              margin-bottom: 5vh;
              overflow: scroll;
            `}
          >
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: {
                  delay: 0.3,
                  duration: 0.3,
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.3,
                },
              }}
              className={css``}
            >
              <div
                className={css`
                  text-align: center;
                  margin: 0 auto;
                  align-items: center;
                  justify-content: center;
                  display: block;
                `}
              >
                {users && (
                  <div>
                    <button
                      className={css`
                        background: rgba(0, 0, 0, 0.2);
                        border: 0;
                        padding-horizontal: 5px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 15px;
                        position: absolute;
                        right: 10px;
                        top: 10px;
                      `}
                      onClick={() => setOpen(false)}
                    >
                      X
                    </button>
                    <ProfilePicture>{users.first_name[0]}</ProfilePicture>
                    <Name>
                      {users.first_name} {users.last_name}
                    </Name>

                    {users.phones.map((phone: Phone, index: number) => {
                      return (
                        <div
                          key={index}
                          className={css`
                            margin-left: auto;
                            margin-right: auto;
                            border-radius: 5px;
                            background-color: #d3d3d3;
                            width: 90%;
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            margin-bottom: 10px;
                            padding: 5px;
                          `}
                        >
                          <p
                            className={css`
                              flex: 1;
                              display: flex;
                              border-bottom: 1px solid black;
                              font-size: 13px;
                            `}
                          >
                            {" "}
                            Number {index + 1}
                          </p>

                          <Number key={index}>{phone.number}</Number>
                        </div>
                      );
                    })}
                    <div
                      className={css`
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                      `}
                    >
                      <button
                        className={css`
                          background: red;
                          color: #fff;
                          border: 0;
                          padding: 10px;
                          border-radius: 8px;
                          cursor: pointer;
                          font-size: 15px;
                          margin: 10px;
                        `}
                        onClick={() => {
                          deleteContact(users.id), setOpen(false);
                        }}
                      >
                        Delete Contact
                      </button>
                      <button
                        className={css`
                          background: green;
                          color: #fff;
                          border: 0;
                          padding: 10px;
                          border-radius: 8px;
                          cursor: pointer;
                          font-size: 15px;
                          margin: 10px;
                        `}
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
