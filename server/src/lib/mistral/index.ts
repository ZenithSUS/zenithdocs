import { Mistral } from "@mistralai/mistralai";
import config from "../../config/env.js";

const client = new Mistral({
  apiKey: config.ai.mistralai,
});

export default client;
