import { type GroupData } from '@/types/groups';

interface GroupFormData {
  id: FormDataEntryValue | null;
  name: FormDataEntryValue | null;
}

interface BaseGroupResponse {
  success: boolean;
  error?: string;
}

interface GroupResponse extends BaseGroupResponse {
  group?: GroupData;
}

interface GroupsResponse extends BaseGroupResponse {
  groups?: GroupData[];
}

async function getGroupByGroupId(id: string): 
  Promise<GroupResponse> {
  const response = await fetch(`/api/groups/${id}`);
  if (response.ok) {
    const group = await response.json();
    return { success: true, group: group }
  }
  else {
    // Parse the response body as JSON
    const body = await response.json();
    return { success: false, error: body.error }
  }
}

async function getAllGroupsByCreatedId(userId: string):
  Promise<GroupsResponse> {
  const response = await fetch(`/api/groups/users/?createdById=${userId}`);
  const body = await response.json();
  if (response.ok) {
    return { success: true, groups: body.groups }
  }
  else {
    // Parse the response body as JSON
    return { success: false, error: body.error }
  }
}

async function getAllGroupsByUserId(userId: string):
  Promise<GroupsResponse> {
  const response = await fetch(`/api/groups/users/?userId=${userId}`);
  const body = await response.json();
  if (response.ok) {
    return { success: true, groups: body.groups }
  }
  else {
    // Parse the response body as JSON
    return { success: false, error: body.error }
  }
}

async function createGroup(
  group: GroupFormData
): Promise<GroupResponse> {
  const response = await fetch(`/api/groups`, {
    method: 'POST',
    body: JSON.stringify(group),
  });
  if (response.ok) {
    const body = await response.json();
    return { success: true, group: body.group}
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