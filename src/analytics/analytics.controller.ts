import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'

import { AnalyticsService } from './analytics.service'

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @MessagePattern('get-top-customers')
  topCustomers() {
    return this.analyticsService.getTopCustomers()
  }

  @MessagePattern('get-customers-per-month')
  customersperMonth() {
    return this.analyticsService.getCustomersPerMonth()
  }

  @MessagePattern('get-top-barbers')
  topBarbers() {
    return this.analyticsService.getTopBarbers()
  }

  @MessagePattern('get-top-services')
  topServices() {
    return this.analyticsService.getTopServices()
  }

  @MessagePattern('get-payments-analytics')
  paymentsAnalytics() {
    return this.analyticsService.getPaymentsAnalytics()
  }

  @MessagePattern('get-payments-analytics-summary')
  paymentsAnalyticsSummary() {
    return this.analyticsService.getPaymentsAnalyticsSummary()
  }

  @MessagePattern('get-barbers-percentage')
  barbersPercentage() {
    return this.analyticsService.getBarbersPercentage()
  }
  @MessagePattern('get-services-percentage')
  servicesPercentage() {
    return this.analyticsService.getServicesPercentage()
  }
  @MessagePattern('get-customers-registered')
  customersRegistered() {
    return this.analyticsService.getCustomersRegistered()
  }
}
