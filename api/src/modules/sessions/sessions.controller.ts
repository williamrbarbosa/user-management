import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';

@Controller('sessions')
@ApiTags('Sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get sessions by user ID' })
  @ApiParam({
    name: 'user_id',
    description: 'The ID of the user',
    type: 'string',
    example: 'a1b2c3d4-e5f6-4789-abcd-ef1234567891',
  })
  findAllByUser(@Param('userId') userId: string) {
    return this.sessionsService.findAllByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session by ID' })
  @ApiParam({
    name: 'user_id',
    description: 'The ID of the user',
    type: 'string',
    example: 'a1b2c3d4-e5f6-4789-abcd-ef1234567891',
  })
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }
}
