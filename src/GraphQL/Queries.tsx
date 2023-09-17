import { gql } from "@apollo/client";

export const LOAD_CONTACT_LIST = gql`
  query GetContactList {
    contact {
      id
      first_name
      last_name
      phones {
        number
      }
    }
  }
`;

export const GET_CONTACT_DETAIL = gql`
  query GetContactDetail($id: Int!) {
    contact_by_pk(id: $id) {
      last_name
      id
      first_name
      created_at
      phones {
        number
      }
    }
  }
`;
