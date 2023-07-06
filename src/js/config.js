import 'dotenv/config';

export const API_URL = `https://forkify-api.herokuapp.com/api/v2/recipes`;
export const TIMEOUT_SEC = 10;
export const RES_PER_PAGE = 10;
export const MODAL_CLOSE_SEC = 1.5;
export const API_KEY = process.env.API_KEY || NETLIFY_API_KEY;
export const DEV_PASS = process.env.DEV_PASS || NETLIFY_DEV_PASS;
