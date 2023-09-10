import env from "react-dotenv";

export const FANTOM_CONFIG = {
	dev: {
		node: env.DEV_FANTOM_NODE,
		contractAddress: env.DEV_FANTOM_CONTRACT_ADDRESS,
	},
	prod: {
		node: env.PROD_FANTOM_NODE,
		contractAddress: env.PROD_FANTOM_CONTRACT_ADDRESS,
	},
}