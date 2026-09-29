import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { Services } from 'src/config/services'
import { envs } from 'src/config/envs'

import { AnalyticsService } from './analytics.service'
import { AnalyticsController } from './analytics.controller'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: Services.USERS_MS,
        transport: Transport.TCP,
        options: { host: envs.usersMsHost, port: envs.usersMsPort },
      },
      {
        name: Services.SERVICES_MS,
        transport: Transport.TCP,
        options: { host: envs.servicesMsHost, port: envs.servicesMsPort },
      },
      {
        name: Services.APPOINTMENTS_MS,
        transport: Transport.TCP,
        options: {
          host: envs.appointmentsMsHost,
          port: envs.appointmentsMsPort,
        },
      },
      {
        name: Services.PAYMENTS_MS,
        transport: Transport.TCP,
        options: {
          host: envs.paymentsMsHost,
          port: envs.paymentsMsPort,
        },
      },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
