import type { ServiceResponseType } from '@/client/services/types';
import { GroupData } from '@/types/model/groups';
import { responseHandler } from '@/client/services/base';

type GroupByUserIdResponseType = ServiceResponseType & {
  data?: GroupData;
}

async function getAllGroupsByUserId(userId: string):
  Promise<GroupByUserIdResponseType> {
  const response = await fetch(`/api/users/groups/?id=${userId}`);
  return await responseHandler(response);
}

export {
  getAllGroupsByUserId
}