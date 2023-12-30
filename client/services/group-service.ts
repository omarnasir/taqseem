import { 
  type GroupData, 
  type CreateGroup,
  type GroupDeleteArgs
} from '@/types/model/groups';
import { type BaseApiResponseType } from '@/types/base-service-response';


type GroupResponseType = BaseApiResponseType & {
  data?: GroupData;
}

async function getGroupByGroupId(id: string): 
  Promise<GroupResponseType> {
  const response = await fetch(`/api/groups/${id}`);
  if (response.ok) {
    const group = await response.json();
    return { success: true, data: group }
  }
  return { success: false, error: response.statusText }
}

async function createGroup(
  group: CreateGroup
): Promise<GroupResponseType> {
  const response = await fetch(`/api/groups`, {
    method: 'POST',
    body: JSON.stringify(group),
  });
  if (response.ok) {
    const body = await response.json();
    return { success: true, data: body }
  }
  return { success: false, error: response.statusText }
}

async function deleteGroup({id, createdById}:
  GroupDeleteArgs
): Promise<GroupResponseType> {
  const response = await fetch(`/api/groups`, {
    method: 'DELETE',
    body: JSON.stringify({ id, createdById }),
  });
  if (response.ok) {
    return { success: true}
  }
  return { success: false, error: response.statusText }
}

export {
  getGroupByGroupId,
  createGroup,
  deleteGroup
}