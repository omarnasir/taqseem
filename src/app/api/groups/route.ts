import { NextResponse } from 'next/server'
import { getAllGroupsService } from "@/server/service/groups.service";

export async function GET() {

  const response = await getAllGroupsService()

  if (!response.success) {
    return NextResponse.json({ error: response.error }, { status: 500 })
  }

  return NextResponse.json(response.data)
}