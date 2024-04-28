import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ActivityLogEventList } from '@shared/constants';
import { SwaggerService } from '@shared/utils';
// import { ClientRMQ } from '@nestjs/microservices';
import { Observable, map } from 'rxjs';
import { ActivityLogService } from 'src/modules/activity-log';
// import { SwaggerService } from '@shared';
// import {
//   AuditLogEventList,
//   SERVICES,
//   MESSAGE_PATTERNS,
// } from '@shared/constants';
// const { ADMIN_CREATE_LOG } = MESSAGE_PATTERNS.USER_ACCOUNT.ADMIN_USER;

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  protected readonly logger = new Logger(ActivityLogInterceptor.name);
  constructor(
    @Inject(ActivityLogService.name)
    private activityLogService: ActivityLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (req.url.includes('undefined')) {
      throw new BadRequestException('Invalid Request URL.');
    }
    SwaggerService.setCurrentApiUrl(
      context.getClass().name,
      context.getHandler().name,
    );

    return next.handle().pipe(
      map(async (res) => {
        const controllerKey = context.getClass().name;
        const methodKey = context.getHandler().name;
        const eventId = `${controllerKey.replace('Controller', '')}.${
          methodKey.charAt(0).toUpperCase() + methodKey.slice(1)
        }`;
        if (Object.values(ActivityLogEventList).includes(eventId as any)) {
          const events = [];
          if (SwaggerService?._document?.paths == undefined) {
            return res;
          }
          Object.values(SwaggerService._document.paths).forEach((methods) => {
            Object.keys(methods).forEach((method) => {
              events.push({
                eventId: methods[method].operationId,
                description: methods[method]?.description || '',
              });
            });
          });
          const eventDateTime = new Date();
          let ip =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          ip = ip?.toString().replace('::ffff:', '');
          const data = {
            userId: req.user?._id || res.data?.user?._id || 'UNKNOWN',
            name: req.user?.name || res.data?.user?.name || 'UNKNOWN',
            role: req.user?.role || res?.data?.user?.role || 'UNKNOWN',
            // opponentId: req?.queryStringParameters?.userId || req?.body?.userId || res?.data?.user?._id,
            status: 'ACTIVE',
            ipAddress: ip,
            eventName:
              events.find((e) => e.eventId === eventId)?.description ||
              eventId
                .split('.')
                .pop()
                .replace(/([a-z])([A-Z])/g, '$1 $2'),
            eventDate: eventDateTime.toLocaleDateString('en-UK'),
            eventTime: eventDateTime.toLocaleTimeString('en-UK'),
          };
          this.activityLogService.createActivityLog(data);
        }
        return res;
      }),
    );
  }
}
