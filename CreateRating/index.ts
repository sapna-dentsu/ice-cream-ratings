import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as db from "../lib/azure-cosmosdb-mongodb";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
  ): Promise<void> {
    try {
      context.log('HTTP trigger function processed a request.');
      let response = null;
  
      // create 1 db connection for all functions
      await db.init();
  
      switch (req.method) {
        case "GET":
          if (req?.query.id || (req?.body && req?.body?.id)) {
            response = {
              documentResponse: await db.findItemById(req?.body?.id),
            };
          } else {
            // allows empty query to return all items
            const dbQuery =
              req?.query?.dbQuery || (req?.body && req?.body?.dbQuery);
            response = {
              documentResponse: await db.findItems(dbQuery),
            };
          }
          break;
        case "POST":
          if (req?.body?.document) {
            const insertOneResponse = await db.addItem(req?.body?.document);
            response = {
              documentResponse: insertOneResponse,
            };
          } else {
            throw Error("No document found");
          }
  
          break;
        case "DELETE":
          if (req?.query?.id || (req?.body && req?.body?.id)) {
            response = {
              documentResponse: await db.deleteItemById(req?.body?.id),
            };
          } else {
            throw Error("No id found");
          }
  
          break;
        default:
          throw Error(`${req.method} not allowed`)
      }
  
      context.res = {
        body: response,
      };
    } catch (err) {
      context.log(`*** Error throw: ${JSON.stringify(err)}`);
  
      context.res = {
        status: 500,
        body: err,
      };
    }
  };
  
  export default httpTrigger;


// const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
//     context.log('HTTP trigger function processed a request.');
//     const name = (req.query.name || (req.body && req.body.name));
//     const responseMessage = name
//         ? "Hello, " + name + ". This HTTP triggered function executed successfully."
//         : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

//     context.res = {
//         // status: 200, /* Defaults to 200 */
//         body: responseMessage
//     };

// };

// export default httpTrigger;