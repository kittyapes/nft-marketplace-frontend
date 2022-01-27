import { gql } from 'graphql-request';

export const GET_ALL_CARDS = gql`
		query ($numberToSkip: Int!) {
			cards(first: 25, skip: $numberToSkip, orderBy: isAvailable, orderDirection: desc) {
				id
				amount
				totalSupply
				maxSupply
				uri
				creationDate
			}
		}
	`;

export const GET_SINGLE_CARD = gql`
	query ($id: String!) {
		card(id: $id)
			{
				id
				amount
				totalSupply
				maxSupply
				uri
				creationDate
			}
		}
	`;