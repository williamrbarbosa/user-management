import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';

@Controller('sessions')
@ApiTags('Sessions')
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all sessions for a user' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    type: 'string',
    example: 'a1b2c3d4-e5f6-4789-abcd-ef1234567891',
  })
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
  findAllByUser(@Param('userId') userId: string): Promise<unknown> {
    return this.sessionsService.findAllByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the session',
    type: 'string',
    example: 'a1b2c3d4-e5f6-4789-abcd-ef1234567891',
  })
  @ApiResponse({ status: 200, description: 'Session retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  findOne(@Param('id') id: string): Promise<unknown> {
    return this.sessionsService.findOne(id);
  }
}
