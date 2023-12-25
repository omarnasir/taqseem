import { type NextResponse } from "next/server";

type BaseApiResponseType = NextResponse & {
  status: number,
  message?: string,
}

export default BaseApiResponseType;