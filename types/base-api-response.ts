import { type NextResponse } from "next/server";

interface BaseApiResponse extends NextResponse {
  status: number,
  message?: string,
}

export default BaseApiResponse;