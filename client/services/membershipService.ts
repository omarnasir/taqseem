import { type UserMembershipByGroup } from '@/types/model/memberships';
import { type BaseApiResponseType } from '@/types/base-service-response';

type MembershipResponseType = BaseApiResponseType & {
  data?: UserMembershipByGroup[];
}

async function getUsersByGroupId({ id }:
  { id: string }): Promise<MembershipResponseType> {
  const response = await fetch(`/api/memberships/?id=${id}`);
  if (response.ok) {
    const memberships = await response.json();
    return { success: true, data: memberships }
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
    return { success: true, data: body.user }
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
  getUsersByGroupId,
  createMembership,
  deleteMembership
}