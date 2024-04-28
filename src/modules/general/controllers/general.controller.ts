import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  UploadedFile,
  Query,
  Put,
} from '@nestjs/common';
import { GeneralService } from '../services/general.service';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiFormData, Auth } from 'src/decorators';
import {
  AddCityReqDto,
  CityIdReqDto,
  CityResDto,
  // CreateAttachmentReqDto,
  CreateProfessionReqDto,
  CreateProfessionResDto,
  DeleteCityResDto,
  // JobAttachmentDto,
  ListCitiesReqDto,
  ListCityResDto,
  ListProfessionResDto,
  ListProfessionsReqDto,
  ProfessionQueryReqDto,
  ProfessionResDto,
  UpdateAppLanguageReqDto,
  UpdateAppLanguageResDto,
  UpdateProfessionReqDto,
} from '../dto';

@Controller('general')
@ApiTags('General')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  @Get('health-check')
  async healthCheck() {
    return {
      healthCheckPassed: true,
      healthCheck: 'Excellent',
    };
  }

  @ApiBearerAuth()
  @Auth()
  @Post('app-language')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UpdateAppLanguageResDto })
  async updateAppLanguage(
    @Req() req: any,
    @Body() payload: UpdateAppLanguageReqDto,
  ) {
    const userId = req?.user?._id;
    return await this.generalService.updateAppLanguage({ userId, ...payload });
  }

  @ApiBearerAuth()
  @Auth()
  @Post('profession')
  @ApiFormData({
    single: true,
    fieldName: 'img',
    fileTypes: ['png', 'jpeg', 'jpg'],
    errorMessage: 'Invalid image file entered.',
    required: true,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CreateProfessionResDto })
  async createProfession(
    @Body() payload: CreateProfessionReqDto,
    @UploadedFile() img: any,
  ) {
    return await this.generalService.createProfession({ img, ...payload });
  }

  @ApiBearerAuth()
  @Auth()
  @Patch('profession/:professionId')
  @ApiFormData({
    single: true,
    fieldName: 'img',
    fileTypes: ['png', 'jpeg', 'jpg'],
    errorMessage: 'Invalid image file entered.',
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProfessionResDto })
  async updateProfession(
    @Param() param: ProfessionQueryReqDto,
    @Body() payload: UpdateProfessionReqDto,
    @UploadedFile() img: any,
  ) {
    return await this.generalService.updateProfession({
      ...param,
      ...payload,
      img,
    });
  }

  @ApiBearerAuth()
  @Auth()
  @Get('profession/:professionId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProfessionResDto })
  async getProfession(@Param() param: ProfessionQueryReqDto) {
    return await this.generalService.getProfession({ ...param });
  }

  @ApiBearerAuth()
  @Auth()
  @Get('professions')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListProfessionResDto })
  async listProfessions(@Query() query: ListProfessionsReqDto) {
    return await this.generalService.listProfessions({ ...query });
  }

  @ApiBearerAuth()
  @Auth()
  @Post('city')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CityResDto })
  async addCity(@Body() payload: AddCityReqDto) {
    return await this.generalService.addCity({ ...payload });
  }

  @ApiBearerAuth()
  @Auth()
  @Put('city/:cityId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CityResDto })
  async updateCity(
    @Param() param: CityIdReqDto,
    @Body() payload: AddCityReqDto,
  ) {
    return await this.generalService.updateCity({ ...param, ...payload });
  }

  @ApiBearerAuth()
  @Auth()
  @Get('city')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListCityResDto })
  async listCities(@Query() query?: ListCitiesReqDto) {
    return await this.generalService.listCities({ ...query });
  }

  @ApiBearerAuth()
  @Auth()
  @Get('city/:cityId')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ type: ListCityResDto })
  async getCities(@Param() param: CityIdReqDto) {
    return await this.generalService.getCity({ ...param });
  }

  @ApiBearerAuth()
  @Auth()
  @Delete('city/:cityId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DeleteCityResDto })
  async deleteCity(@Param() param: CityIdReqDto) {
    return await this.generalService.deleteCity({ ...param });
  }

  // @Post('attachment')
  // @ApiFormData({
  //   single: true,
  //   fieldName: 'attachment',
  //   fileTypes: ['png', 'jpeg', 'jpg', 'mp4', 'avi', 'mov'],
  //   errorMessage: 'Invalid file entered.',
  //   required: true,
  // })
  // @HttpCode(HttpStatus.CREATED)
  // // @ApiCreatedResponse({ type: CreateJobResDto })
  // async createAttachment(
  //   @Req() req: any,
  //   @Body() payload: CreateAttachmentReqDto,
  //   @UploadedFile() attachment: any,
  // ) {
  //   return await this.generalService.createAttachment({
  //     userId: '65d681d84c1b9832184519cb', // req?.user?._id,
  //     ...payload,
  //     attachment,
  //   });
  // }
}
