import { defineEventHandler, EventHandlerResponse } from "h3";
import adminConfig from "~/models/Admin";

interface Credentials {
  username: string;
  password: string;
}

export default defineEventHandler(
  async (event): Promise<EventHandlerResponse> => {
    const { req, res } = event;

    if (req.method !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    try {
      const body = await getRequestBody<Credentials>(req);
      const { username, password } = body;

      const expectedUsername = adminConfig.adminUsername;
      const expectedPassword = adminConfig.adminPassword;

      if (username === expectedUsername && password === expectedPassword) {
        return {
          statusCode: 200,
          apiToken: adminConfig.apiToken,
          body: JSON.stringify({ authenticated: true }),
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }
    } catch (error) {
      console.error("Error parsing request or checking login:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  }
);

async function getRequestBody<T>(req: any): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: any) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body) as T);
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", (error: any) => {
      reject(error);
    });
  });
}
