import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Req,
  UploadedFiles,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { JobService } from '../services/job.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiFormData, Auth } from 'src/decorators';
import {
  CreateJobReqDto,
  DeleteJobRequestResDto,
  GetJobReqDto,
  GetRFQReqDto,
  GetRFQResDto,
  ListJobsReqDto,
  ListUserRFQsResDto,
  RespondRFQReqDto,
  RespondRFQResDto,
  SendRFQReqDto,
  SendRFQResDto,
  UpdateJobReqDto,
} from '../dto';
import { MultipleAttachmentDto } from '@shared/dto';

@Controller('job')
@ApiTags('Job')
@ApiBearerAuth()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Auth()
  @Post()
  @ApiFormData({
    multiple: true,
    fieldName: 'media',
    fileTypes: ['png', 'jpeg', 'jpg', 'mp4', 'avi', 'mov'],
    errorMessage: 'Invalid file entered.',
    required: true,
    maxCount: 6,
  })
  @HttpCode(HttpStatus.CREATED)
  // @ApiCreatedResponse({ type: CreateJobResDto })
  async createJob(
    @Req() req: any,
    @Body() payload: CreateJobReqDto,
    @UploadedFiles() { media }: MultipleAttachmentDto,
  ) {
    return await this.jobService.createJob({
      userId: req?.user?._id,
      ...payload,
      media,
    });
  }

  @Auth()
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async listJobs(@Req() req: any, @Query() query: ListJobsReqDto) {
    return await this.jobService.listJobs({ userId: req?.user?._id, ...query });
  }

  @Auth()
  @Post('request-delete/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DeleteJobRequestResDto })
  async deleteJobRequest(@Req() req: any, @Param() param: GetJobReqDto) {
    return await this.jobService.deleteJobRequest({
      userId: req?.user?._id,
      ...param,
    });
  }

  @Auth()
  @Put('/:jobId')
  @HttpCode(HttpStatus.OK)
  async updateJob(
    @Param() param: GetJobReqDto,
    @Body() payload: UpdateJobReqDto,
  ) {
    return await this.jobService.updateJob({ ...param, ...payload });
  }

  @Auth()
  @Post('send-job-request')
  @ApiFormData({
    multiple: true,
    fieldName: 'media',
    fileTypes: ['png', 'jpeg', 'jpg', 'mp4', 'avi', 'mov'],
    errorMessage: 'Invalid file entered.',
    required: true,
    maxCount: 6,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: SendRFQResDto })
  async sendJobRequest(
    @Req() req: any,
    @Body() payload: SendRFQReqDto,
    @UploadedFiles() { media }: MultipleAttachmentDto,
  ) {
    return await this.jobService.sendJobRequest({
      userId: req?.user?._id,
      ...payload,
      media,
    });
  }

  @Auth()
  @Get('list-rfqs')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: ListUserRFQsResDto })
  async listRFQs(@Req() req: any) {
    return await this.jobService.listUserRFQs({
      userId: req?.user?._id,
    });
  }

  @Auth()
  @Get('get-rfq/:rfqId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetRFQResDto })
  async getRFQ(@Param() param: GetRFQReqDto) {
    return await this.jobService.getRFQ({
      ...param,
    });
  }

  @Auth()
  @Put('respond-rfq/:rfqId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RespondRFQResDto })
  async respondRFQ(
    @Req() req: any,
    @Param() param: GetRFQReqDto,
    @Body() payload: RespondRFQReqDto,
  ) {
    return await this.jobService.respondRFQ({
      userId: req?.user?._id,
      ...payload,
      ...param,
    });
  }

  @Auth()
  @Get('/:jobId')
  @HttpCode(HttpStatus.OK)
  async getJob(@Req() req: any, @Param() param: GetJobReqDto) {
    return await this.jobService.getJob({ role: req?.user?.role, ...param });
  }
}
