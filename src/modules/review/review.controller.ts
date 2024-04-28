import {
  Controller,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import {
  CreateReviewDto,
  CreateReviewResDto,
  ListReviewReqDto,
  ListReviewsResDto,
  StatisticsResDto,
  statisticsReqDto,
} from './dto';
import { ReviewService } from './review.service';

@Controller('review')
@ApiTags('Review')
@ApiBearerAuth()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Auth()
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CreateReviewResDto })
  async create(@Req() req: any, @Body() payload: CreateReviewDto) {
    const { _id: userId } = req?.user;
    return await this.reviewService.create({ userId, ...payload });
  }

  @Auth()
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: ListReviewsResDto })
  async list(@Req() req: any, @Query() params: ListReviewReqDto) {
    // const { _id: providerId } = req?.user;  // list will be shown to customer. so the loggedIn user will be customer
    return await this.reviewService.list({ ...params });
  }

  @Auth()
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: StatisticsResDto })
  async statistics(@Req() req: any, @Query() payload: statisticsReqDto) {
    const { _id: providerId } = req?.user;
    return await this.reviewService.statistics({ providerId, ...payload });
  }
}
