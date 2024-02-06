import { 
  type GroupData, 
  type CreateGroup,
  type GroupDeleteArgs,
  type GroupWithMembers
} from '@/app/_types/model/groups';
import { responseHandler, type ServiceResponseType } from '@/app/_lib/base-service';

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

async function getTransactionsByGroupId(id: string): Promise<GETResponseType> {
  const response = await fetch(`/api/groups/transactions/?id=${id}`);
  return await responseHandler(response);
}

export {
  getGroupDetails,
  createGroup,
  deleteGroup,
  getTransactionsByGroupId
}