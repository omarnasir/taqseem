import { type GroupData } from '@/types/model/groups';
import { type BaseApiResponseType } from '@/types/base-service-response';

type GroupFormDataType = {
  id: FormDataEntryValue | null;
  name: FormDataEntryValue | null;
}

type GroupResponseType = BaseApiResponseType & {
  data?: GroupData;
}

type GroupsResponseType = BaseApiResponseType & {
  data?: GroupData[];
}

async function getGroupByGroupId(id: string): 
  Promise<GroupResponseType> {
  const response = await fetch(`/api/groups/${id}`);
  if (response.ok) {
    const group = await response.json();
    return { success: true, data: group }
  }
  else {
    // Parse the response body as JSON
    const body = await response.json();
    return { success: false, error: body.error }
  }
}

async function getAllGroupsByCreatedId(userId: string):
  Promise<GroupsResponseType> {
  const response = await fetch(`/api/groups/users/?createdById=${userId}`);
  const body = await response.json();
  if (response.ok) {
    return { success: true, data: body.groups }
  }
  else {
    // Parse the response body as JSON
    return { success: false, error: body.error }
  }
}

async function getAllGroupsByUserId(userId: string):
  Promise<GroupsResponseType> {
  const response = await fetch(`/api/groups/users/?userId=${userId}`);
  const body = await response.json();
  if (response.ok) {
    return { success: true, data: body.groups }
  }
  else {
    // Parse the response body as JSON
    return { success: false, error: body.error }
  }
}

async function createGroup(
  group: GroupFormDataType
): Promise<GroupResponseType> {
  const response = await fetch(`/api/groups`, {
    method: 'POST',
    body: JSON.stringify(group),
  });
  if (response.ok) {
    const body = await response.json();
    return { success: true, data: body.group}
  }
  else {
    // Parse the response body as JSON
    const body = await response.json();
    return { success: false, error: body.error }
  }
}
export {
  getGroupByGroupId,
  getAllGroupsByCreatedId,
  getAllGroupsByUserId,
  createGroup
}