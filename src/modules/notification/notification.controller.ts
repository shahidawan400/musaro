import {
    Controller,
    Body,
    Req,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    Get,
    Query,
    Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { ChangeStatusReqDto, GetNotificationsResDto, ListNotificationsReqDto, ListNotificationsResDto, NotificationQueryReqDto, SaveTokenReqDto, SaveTokenResDto, SettingsReqDto, SettingsResDto, StatusResDto, sendNoificationReqDto } from './dto';
import { NotificationService } from './notification.service';

@Controller('notification')
@ApiTags('Notification')
@ApiBearerAuth()
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Auth()
    @Post('save-token')
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ type: SaveTokenResDto })
    async saveToken(
        @Req() req: any,
        @Body() payload: SaveTokenReqDto,
    ) {
        const { _id: userId } = req?.user;
        return await this.notificationService.saveToken({ userId, ...payload })
    }

    @Auth()
    @Put('settings')
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({ type: SettingsResDto })
    async settings(
        @Req() req: any,
        @Body() payload: SettingsReqDto,
    ) {
        const { _id: userId } = req?.user;
        return await this.notificationService.settings({ userId, ...payload })
    }

    @Auth()
    @Put('status')
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({ type: StatusResDto })
    async changeStatus(
        @Req() req: any,
        @Body() payload: ChangeStatusReqDto,
    ) {
        const { _id: userId } = req?.user;
        return await this.notificationService.changeStatus({ userId, ...payload })
    }

    @Auth()
    @Post('send')
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({ type: '' })
    async sendNoification(
        @Req() req: any,
        @Body() payload: sendNoificationReqDto,
    ) {
        const { _id: senderId } = req?.user;
        return await this.notificationService.sendNotification({ senderId, ...payload })
    }

    @Auth()
    @Get('notifications')
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({ type: ListNotificationsResDto })
    async listNotifications(
        @Req() req: any,
        @Query() payload: ListNotificationsReqDto,
    ) {
        const { _id: userId } = req?.user;
        return await this.notificationService.listNotifications({ userId, ...payload })
    }

    @Auth()
    @Get(':notificationId')
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({ type: GetNotificationsResDto })

    async getNotification(
        @Req() req: any,
        @Param() param: NotificationQueryReqDto
    ) {
        const { _id: userId } = req?.user;
        return await this.notificationService.getNotification({ userId, ...param })
    }

}
