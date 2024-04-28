import {
  Controller,
  Get,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Put,
  UploadedFile,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import {
  AvailabilityReqDto,
  GetProviderProfileResDto,
  GetProviderReqDto,
  ListProvidersReqDto,
  ListProvidersResDto,
  ProviderAvailabilityResDto,
  UpdateProviderProfileReqDto,
  UpdateProviderProfileResDto,
} from '../dto';
import { ProviderService } from '../services';
import { ApiFormData } from 'src/decorators';
import { UserIdDto } from '@shared/dto';

@Controller('provider')
@ApiTags('Provider')
@ApiBearerAuth()
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Auth()
  @Put('profile')
  @ApiFormData({
    single: true,
    fieldName: 'idPicture',
    fileTypes: ['png', 'jpeg', 'jpg'],
    errorMessage: 'Invalid image file entered.',
    required: true,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ type: UpdateProviderProfileResDto })
  async updateProfile(
    @Req() req: any,
    @Body() payload: UpdateProviderProfileReqDto,
    @UploadedFile() idPicture: any,
  ) {
    const { _id } = req?.user;
    return await this.providerService.updateProfile({
      _id,
      idPicture,
      ...payload,
    });
  }

  @Auth()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetProviderProfileResDto })
  async getProfile(
    @Req() req: any,
    // @Query() query: GetProviderReqDto
  ) {
    return await this.providerService.getProviderProfile({
      userId: req?.user?._id,
      // providerId: query?.providerId,
    });
  }

  @Auth()
  @Get('list')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListProvidersResDto })
  async listProviders(@Query() query: ListProvidersReqDto) {
    return await this.providerService.listProviders({ ...query });
  }

  @Auth()
  @Patch('available')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ type: ProviderAvailabilityResDto })
  async setAvailability(@Req() req: any, @Query() query: AvailabilityReqDto) {
    const { _id: userId } = req?.user;
    return await this.providerService.setAvailability({
      userId,
      ...query,
    });
  }

  @Auth()
  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetProviderProfileResDto })
  async getDetail(@Req() req: any, @Param() param: UserIdDto) {
    return await this.providerService.getProviderDetail({
      createdBy: req?.user?._id,
      ...param,
    });
  }
}
