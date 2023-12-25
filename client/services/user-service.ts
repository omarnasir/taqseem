import type { UserBelongingToGroups } from '@/types/model/users';
import type { BaseApiResponseType } from '@/types/base-service-response';

type AllGroupsByUserIdResponseType = BaseApiResponseType&  {
  data?: UserBelongingToGroups['groups'],
}

export {
  type AllGroupsByUserIdResponseType
}