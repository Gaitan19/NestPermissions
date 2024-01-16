import { Module } from '@nestjs/common';
import { EmailLogsService } from './email-logs.service';
import { EmailLogsController } from './email-logs.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'apps/auth-service/src/auth/constants/jwt.constant';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'MAIL_SERVICE', transport: Transport.TCP },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [EmailLogsController],
  providers: [EmailLogsService],
})
export class EmailLogsModule {}
