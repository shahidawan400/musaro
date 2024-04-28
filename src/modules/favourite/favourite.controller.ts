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
import { FavouriteService } from './favourite.service';
import {
  CreateFavouriteReqDto,
  CreateFavouriteResDto,
  GetUserFavouriteResDto,
  ListFavouriteReqDto,
} from './dto';

@Controller('favourite')
@ApiTags('Favourite')
@ApiBearerAuth()
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Auth()
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CreateFavouriteResDto })
  async create(@Req() req: any, @Body() payload: CreateFavouriteReqDto) {
    const { _id: userId } = req?.user;
    return await this.favouriteService.create({
      favouriteBy: userId,
      ...payload,
    });
  }

  @Auth()
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: GetUserFavouriteResDto })
  async list(@Req() req: any, @Query() payload: ListFavouriteReqDto) {
    const { _id: userId } = req?.user;
    return await this.favouriteService.listUserFavourites({
      userId,
      ...payload,
    });
  }
}
