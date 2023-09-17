import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import GetContactList from "./components/GetContactList";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { AddContact } from "./components/AddContact";

const client = new ApolloClient({
  uri: "https://wpe-hiring.tokopedia.net/graphql",
  cache: new InMemoryCache(),
});

const Container = styled.div`
  font-family: Arial, Verdana, sans-serif;
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
`;
const H1 = styled.h1`
  flex: 1;
  padding: 0px;
`;
const Button = styled.button`
  font-size: 40px;
  background-color: rgba(52, 52, 52, 0);
  border: 0px;
`;
const Search = styled.button`
  font-size: 20px;
  background-color: rgba(52, 52, 52, 0);
  border-left: 1px;
  border-right: 1px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 5px;
`;

function App() {
  const modalRef = useRef<any>();
  return (
    <ApolloProvider client={client}>
      <Container>
        <Header>
          <H1>Contacts</H1>
          <Button onClick={() => modalRef.current.open()}> + </Button>
          <AddContact ref={modalRef}/>
        </Header>
        <GetContactList />
      </Container>
    </ApolloProvider>
  );
}

export default App;
