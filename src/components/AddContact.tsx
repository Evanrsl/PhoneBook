import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { motion, AnimatePresence } from "framer-motion";
import { ADD_CONTACT } from "../GraphQL/Mutations";
import { GET_CONTACT_DETAIL, LOAD_CONTACT_LIST } from "../GraphQL/Queries";
import { useMutation, useQuery } from "@apollo/client";

const Label = styled.label`
  text-align: left;
  display: block;
  font-size: 15px;
`;
const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid black;
  box-sizing: border-box;
  display: block;
`;

export const AddContact = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactExist, setContactExist] = useState(false);

  const { data } = useQuery(LOAD_CONTACT_LIST);
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    if (data) {
      setUsers(data.contact);
    }
  }, [data]);
  const checkExist = () => {
    if (
      users.some((e) => {
        if (
          e.first_name.toLowerCase() === firstName.toLowerCase() ||
          e.last_name.toLowerCase() === lastName.toLowerCase()
        ) {
          console.log(e.id);
          return true;
        }
        return false;
      })
    ) {
      return true;
    } else {
      return false;
    }
  };
  const addNewContact = () => {
    if (checkExist()) {
      setContactExist(true);
    } else {
      insert_contact({
        variables: {
          first_name: firstName,
          last_name: lastName,
          phones: stringNumber,
        },
      });
      setOpen(false);
    }
    if (error) {
      console.log(error);
    }
  };

  const [insert_contact, { error }] = useMutation(ADD_CONTACT, {
    refetchQueries: [{ query: GET_CONTACT_DETAIL }],
  });

  useImperativeHandle(ref, () => {
    return {
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
  });

  //special character
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const checkFirstName = (name: string) => {
    if (format.test(name)) {
      return css`
        background-color: pink;
      `;
    }
  };
  const checkLastName = (name: string) => {
    if (format.test(name)) {
      return css`
        background-color: pink;
      `;
    }
  };
  const checkValidFirst = (name: string) => {
    format.test(name) ? setValidFirstName(false) : setValidFirstName(true);
  };
  const checkValidLast = (name: string) => {
    format.test(name) ? setValidLastName(false) : setValidLastName(true);
  };
  const [validFirstName, setValidFirstName] = useState(true);
  const [validLastName, setValidLastName] = useState(true);

  //multiple number
  const inputArr = [
    {
      id: 1,
      value: "",
    },
  ];
  const [arr, setArr] = useState(inputArr);
  const addInput = () => {
    setArr((s: any) => {
      return [
        ...s,
        {
          value: "",
        },
      ];
    });
  };
  const removeInput = () => {
    setArr(arr.slice(0, -1));
  };
  const handleChange = (e: any) => {
    e.preventDefault();

    const index = e.target.id;
    setArr((s) => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;
      return newArr;
    });
  };
  const stringNumber = arr.map((x) => ({
    number: `${x.value}`,
  }));

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
              scale: 0,
            }}
            animate={{
              scale: 1,
              transition: {
                duration: 0.3,
              },
            }}
            exit={{
              scale: 0,
              transition: {
                delay: 0.3,
              },
            }}
            className={css`
              position: fixed;
              height: 60vh;
              width: 90vw;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              margin: auto;
              padding: 10px;
              background: white;
              border-radius: 10px;
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
                `}
              >
                <button
                  className={css`
                    background: rgba(0, 0, 0, 0.2);
                    border: 0;
                    padding: 5px 10px;
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

                <h2> Add New Contact</h2>
                {contactExist && (
                  <p>
                    {firstName} {lastName} already exist!!
                  </p>
                )}
                <form>
                  <Label>First Name:</Label>
                  <Input
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      checkValidFirst(e.target.value);
                      setContactExist(false);
                    }}
                    className={checkFirstName(firstName)}
                    required
                  />
                  <Label>Last Name:</Label>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => {
                      setLastName(e.target.value);
                      checkValidLast(e.target.value);
                      setContactExist(false);
                    }}
                    className={checkLastName(lastName)}
                    required
                  />

                  {arr.map((item, i) => {
                    return (
                      <div key={i}>
                        <Label>Number {i + 1}:</Label>
                        <Input
                          onChange={handleChange}
                          id={`${i}`}
                          type="type"
                          placeholder={`Number ${i + 1}`}
                          required
                        />
                      </div>
                    );
                  })}
                  <div
                    className={css`
                      display: flex;
                      flex-direction: row;
                      justify-content: center;
                    `}
                  >
                    <button
                      className={css`
                        background: green;
                        color: #fff;
                        border: 0;
                        padding: 8px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 15px;
                        margin: 5px;
                      `}
                      onClick={removeInput}
                    >
                      Remove Last number
                    </button>
                    <button
                      className={css`
                        background: green;
                        color: #fff;
                        border: 0;
                        padding: 8px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 15px;
                        margin: 5px;
                      `}
                      onClick={addInput}
                    >
                      Add more number
                    </button>
                  </div>
                  <button
                    className={css`
                      background: green;
                      color: #fff;
                      border: 0;
                      padding: 8px 15px;
                      margin: 5px;
                      border-radius: 8px;
                      cursor: pointer;
                      font-size: 15px;
                    `}
                    onClick={addNewContact}
                    disabled={!validFirstName || !validLastName}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
