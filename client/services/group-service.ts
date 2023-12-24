import { type GroupData } from '@/types/model/groups';
import { type IBaseApiResponse } from '@/types/base-service-response';

interface GroupFormData {
  id: FormDataEntryValue | null;
  name: FormDataEntryValue | null;
}

interface IGroupResponse extends IBaseApiResponse {
  data?: GroupData;
}

interface IGroupsResponse extends IBaseApiResponse {
  data?: GroupData[];
}

async function getGroupByGroupId(id: string): 
  Promise<IGroupResponse> {
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
  Promise<IGroupsResponse> {
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
  Promise<IGroupsResponse> {
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
  group: GroupFormData
): Promise<IGroupResponse> {
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