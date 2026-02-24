import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { UserFromJwt } from '../auth/models/UserFromJwt';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new user bla' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates an existing user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to update',
    type: 'string',
    example: 'a1b2c3d4-e5f6-4789-abcd-ef1234567891',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an user by ID.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to delete',
    type: 'string',
    example: 'a1b2c3d4-e5f6-4789-abcd-ef1234567891',
  })
  remove(@Param('id') id: string, @User() user: UserFromJwt) {
    return this.usersService.remove(id, user.id);
  }

  @Get()
  @ApiOperation({
    summary:
      'List all users for a given broker group (with optional pagination)',
  })
  @ApiQuery({ name: 'page', required: false })
  findAll(@Query('page') page?: number) {
    return this.usersService.findAll(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user',
    type: 'string',
    example: 'a1b2c3d4-e5f6-4789-abcd-ef1234567891',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOneWithSessions(id);
  }
}
