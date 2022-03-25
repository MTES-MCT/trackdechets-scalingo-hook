const { default: axios } = require("axios");

const SCALINGO_API_URL = "https://api.osc-secnum-fr1.scalingo.com";

const { SCALINGO_TOKEN } = process.env;

async function restartApp(appId) {
  const bearer = await getBearerToken();
  return axios.post(
    `${SCALINGO_API_URL}/v1/apps/${appId}/restart`,
    {
      scope: ["web"]
    },

    {
      headers: {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  );
}

async function getBearerToken() {
  const r = await axios.post(
    `https://auth.scalingo.com/v1/tokens/exchange`,
    {},
    { auth: { username: "", password: SCALINGO_TOKEN } }
  );
  return r.data.token;
}

module.exports = {
  restartApp
};
