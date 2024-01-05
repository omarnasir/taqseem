import { ServiceResponseType } from "./types";

async function responseHandler(response: Response): Promise<ServiceResponseType> {
  if (response.ok) {
    if (response.body) {
      const body = await response.json();
      return { success: true, data: body.data }
    }
    return { success: true }
  }
  return { success: false, error: response.statusText }
}

export {
  responseHandler
}