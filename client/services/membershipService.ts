import { 
  type MembershipDefaultArgs,
  type CreateMembershipArgs
} from '@/types/model/memberships';
import { type UserBasicData } from '@/types/model/users';
import { type ServiceResponseType } from '@/client/services/types';
import { responseHandler } from '@/client/services/base';


type MembershipResponseType = ServiceResponseType & {
  data?: UserBasicData[];
}

async function getMembershipsByGroupId(groupId: string): 
  Promise<MembershipResponseType> {
  const response = await fetch(`/api/memberships/?groupId=${groupId}`);
  return await responseHandler(response);
}

async function createMembership(reqData: CreateMembershipArgs
): Promise<MembershipResponseType> {
  const response = await fetch(`/api/memberships`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqData)
  });
  return await responseHandler(response);
}

async function deleteMembership(reqData : MembershipDefaultArgs
): Promise<MembershipResponseType> {
  const response = await fetch(`/api/memberships`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqData)
  });
  return await responseHandler(response);
}

export {
  getMembershipsByGroupId,
  createMembership,
  deleteMembership
}