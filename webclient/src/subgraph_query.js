import { gql } from "@apollo/client";

export const get30DaysPrice = gql`
  query Token($tokenAddress: String) {
    token(id: $tokenAddress) {
      id
      derivedETH
      dayData(first: 30, orderBy: date, orderDirection: desc) {
        id
        date
        priceUSD
      }
    }
  }
`;

export const get2DaysPrice = gql`
  query Token($tokenAddress: String) {
    token(id: $tokenAddress) {
      id
      derivedETH
      dayData(first: 2, orderBy: date, orderDirection: desc) {
        id
        date
        priceUSD
      }
    }
  }
`;
