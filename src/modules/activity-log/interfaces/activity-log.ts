import { ActivityLogType, DateRangeOption } from '@shared/constants';

export interface IFindByFilter {
  createdBy?: string;
  userId?: string;
  logType?: ActivityLogType;
  timestamp?: string;
  option?: DateRangeOption;
  startDate?: string;
  endDate?: string;
  isFilter?: boolean;
}
