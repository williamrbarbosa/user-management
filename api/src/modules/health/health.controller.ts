import { Controller, Get } from '@nestjs/common';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@Controller('health')
export class HealthController {
  @Get()
  @IsPublic()
  health() {
    return { status: 'ok' };
  }
}
