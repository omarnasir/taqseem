import { type UserMembershipsByGroup } from '@/types/model/memberships';
import { type BaseApiResponseType } from '@/types/base-service-response';

type MembershipResponseType = BaseApiResponseType & {
  data?: UserMembershipsByGroup;
}

async function getUsersByGroupId(id: string): Promise<MembershipResponseType> {
  const response = await fetch(`/api/memberships/?id=${id}`);
  if (response.ok) {
    const users = await response.json();
    return { success: true, data: users }
  }
  else {
    // Parse the response body as JSON
    const body = await response.json();
    return { success: false, error: body.error }
  }
}

export {
  getUsersByGroupId
}