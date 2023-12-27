import { NextResponse } from "next/server";

function sendErrorResponse(
  { status, statusText }: {
    status?: number,
    statusText?: string
  }
): NextResponse {
  return new NextResponse(null, {
    status: status ? status : 500,
    statusText: statusText ? statusText : "Server error"
  });
}

export {
  sendErrorResponse
}