import type { UserBelongingToGroups } from '@/types/model/users';
import type { IBaseApiResponse } from '@/types/base-service-response';

interface IgetAllGroupsByUserIdResponse extends IBaseApiResponse {
  data?: UserBelongingToGroups['groups'],
}

export {
  type IgetAllGroupsByUserIdResponse
}