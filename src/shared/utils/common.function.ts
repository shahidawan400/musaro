import * as dayjs from 'dayjs';
import mongoose from 'mongoose';
import { IOTP } from '../interfaces/common.interface';
import { DateRangeOption } from '../constants/enums';

export function generateOTP(): number {
  const min = 10000;
  const max = 99999;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateOtpWithExpiry(): IOTP {
  const otpCode = generateOTP();

  // Set expiration time to 5 minutes from now
  const expirationTime = dayjs()
    .add(Number(process.env.OTP_EXPIRY || 5), 'minutes')
    .toDate();

  return {
    code: otpCode,
    expiresAt: expirationTime,
  };
}

export function getDataByDateRange(
  option: DateRangeOption,
  startDate?: Date | string,
  endDate?: Date | string,
) {
  let calculatedStartDate: Date | undefined,
    calculatedEndDate: Date | undefined;

  switch (option) {
    case DateRangeOption.THIS_MONTH:
      const currentMonth = new Date().getUTCMonth();
      const currentYear = new Date().getUTCFullYear();

      calculatedStartDate = new Date(Date.UTC(currentYear, currentMonth, 1));
      calculatedEndDate = new Date(
        Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999),
      );
      break;
    case DateRangeOption.LAST_MONTH:
      const lastMonth = new Date().getUTCMonth() - 1;
      const lastMonthYear =
        lastMonth < 0
          ? new Date().getUTCFullYear() - 1
          : new Date().getUTCFullYear();
      const lastMonthAdjusted = lastMonth < 0 ? lastMonth + 12 : lastMonth;
      calculatedStartDate = new Date(
        Date.UTC(lastMonthYear, lastMonthAdjusted, 1),
      );
      calculatedEndDate = new Date(
        Date.UTC(lastMonthYear, lastMonthAdjusted + 1, 0, 23, 59, 59, 999),
      );
      break;
    case DateRangeOption.THIS_YEAR:
      const thisYear = new Date().getUTCFullYear();
      calculatedStartDate = new Date(Date.UTC(thisYear, 0, 1));
      calculatedEndDate = new Date(Date.UTC(thisYear, 11, 31, 23, 59, 59, 999));
      break;
    case DateRangeOption.LAST_YEAR:
      const lastYear = new Date().getUTCFullYear() - 1;
      calculatedStartDate = new Date(Date.UTC(lastYear, 0, 1));
      calculatedEndDate = new Date(Date.UTC(lastYear, 11, 31, 23, 59, 59, 999));
      break;
    case DateRangeOption.CUSTOM_RANGE:
      if (startDate && endDate) {
        calculatedStartDate = new Date(startDate);
        calculatedEndDate = new Date(endDate);
      }
      break;
    default:
      break;
  }

  return { startDate: calculatedStartDate, endDate: calculatedEndDate };
}

export function cleanObject(object: any): any {
  const obj = JSON.parse(JSON.stringify(object));
  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  } else if (typeof obj === 'object' && obj !== null) {
    const cleanedEntries = Object.entries(obj)
      .map(([key, value]) => {
        if (mongoose.isValidObjectId(value)) {
          return [key, new mongoose.Types.ObjectId(value as any)];
        }
        return [key, convertToDateIfValid(value)];
      })
      .filter(([_, value]) => value !== undefined);

    return Object.fromEntries(cleanedEntries);
  }
  return obj;
}

function convertToDateIfValid(value: any): Date | any {
  if (typeof value === 'string') {
    const timestamp = Date.parse(value);
    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    }
    return value;
  }
  return value;
}
