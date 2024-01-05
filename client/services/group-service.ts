import { 
  type GroupData, 
  type CreateGroup,
  type GroupDeleteArgs,
  type GroupWithMembers
} from '@/types/model/groups';
import { type ServiceResponseType } from '@/client/services/types';
import { responseHandler } from '@/client/services/base';

type CreateOrDeleteResponseType = ServiceResponseType & {
  data?: GroupData;
}
type GETResponseType = ServiceResponseType & {
  data?: GroupWithMembers
}

async function getGroupDetails(id: string): 
  Promise<GETResponseType> {
  const response = await fetch(`/api/groups/?id=${id}`);
  return await responseHandler(response);
}

async function createGroup(reqData: CreateGroup
): Promise<CreateOrDeleteResponseType> {
  const response = await fetch(`/api/groups`, {
    method: 'POST',
    body: JSON.stringify(reqData),
  });
  return await responseHandler(response);
}

async function deleteGroup(reqData: GroupDeleteArgs
): Promise<CreateOrDeleteResponseType> {
  const response = await fetch(`/api/groups`, {
    method: 'DELETE',
    body: JSON.stringify(reqData),
  });
  return await responseHandler(response);
}

export {
  getGroupDetails,
  createGroup,
  deleteGroup
}