import { GroupData } from '@/app/_types/model/groups';
import { responseHandler, type ServiceResponseType } from '@/app/_lib/base-service';

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