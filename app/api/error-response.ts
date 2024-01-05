import { NextResponse } from "next/server";

function sendErrorResponse(
  { status, statusText }: {
    status?: number,
    statusText?: string
  }
): NextResponse<any> {
  const response = new NextResponse(null, {
    status: status ? status : 500,
    statusText: statusText ? statusText : "Server error"
  });
  return response;
}

export {
  sendErrorResponse
}