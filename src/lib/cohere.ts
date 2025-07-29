import { CohereClientV2 } from "cohere-ai";

export const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
