import { Module, Controller, Get } from '@nestjs/common';

@Controller()
class TestController {
  @Get('health')
  health() {
    return { status: 'minimal-ok', timestamp: new Date().toISOString() };
  }
}

@Module({
  controllers: [TestController],
})
export class TestAppModule {}
