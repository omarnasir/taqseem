import { type UserMembershipsByGroup } from '@/types/model/memberships';
import { type IBaseApiResponse } from '@/types/base-service-response';

interface IMembershipResponse extends IBaseApiResponse {
  data?: UserMembershipsByGroup;
}

async function getUsersByGroupId(id: string): Promise<IMembershipResponse> {
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