import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
/**
 * @description Auth is used for JWT Authentication
 */
export const Auth = () =>
  applyDecorators(SetMetadata('authenticatedOnly', true), ApiBearerAuth());
