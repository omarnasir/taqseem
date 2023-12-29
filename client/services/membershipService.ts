import { type UserMembershipByGroup } from '@/types/model/memberships';
import { type BaseApiResponseType } from '@/types/base-service-response';

type MembershipResponseType = BaseApiResponseType & {
  data?: UserMembershipByGroup[];
}

async function getMembershipsByGroupId(groupId: string): 
  Promise<MembershipResponseType> {
  const response = await fetch(`/api/memberships/?groupId=${groupId}`);
  if (response.ok) {
    const body = await response.json();
    return { success: true, data: body }
  }
  return { success: false, error: response.statusText }
}

async function createMembership({ groupId, userEmail }
  : { groupId: string, userEmail: string }
): Promise<MembershipResponseType> {
  const response = await fetch(`/api/memberships`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ groupId, userEmail })
  });
  if (response.ok) {
    const body = await response.json();
    return { success: true, data: body }
  }
  return { success: false, error: response.statusText }
}

async function deleteMembership({ groupId, userId }
  : { groupId: string, userId: string }
): Promise<MembershipResponseType> {
  const response = await fetch(`/api/memberships`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ groupId, userId })
  });
  if (response.ok) {
    return { success: true }
  }
  return { success: false, error: response.statusText }
}

export {
  getMembershipsByGroupId,
  createMembership,
  deleteMembership
}