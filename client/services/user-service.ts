import type { BaseApiResponseType } from '@/types/base-service-response';
import { GroupData } from '@/types/model/groups';

type GroupByUserIdResponseType = BaseApiResponseType & {
  data?: GroupData;
}

async function getAllGroupsByUserId(userId: string):
  Promise<GroupByUserIdResponseType> {
  const response = await fetch(`/api/users/groups/?id=${userId}`);
  if (response.ok) {
    const body = await response.json();
    return { success: true, data: body }
  }
  return { success: false, error: response.statusText }
}

export {
  getAllGroupsByUserId
}