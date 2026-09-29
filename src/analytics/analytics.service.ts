import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { catchError, firstValueFrom } from 'rxjs'
import { Services } from 'src/config/services'

type TopCustomers = {
  customerId: number
  _count: {
    customerId: number
  }
}[]

type TopServices = {
  serviceId: number
  _count: {
    serviceId: number
  }
}[]

type TopBarbers = {
  barberId: number
  _count: {
    barberId: number
  }
}[]

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(Services.APPOINTMENTS_MS)
    private readonly appointments: ClientProxy,
    @Inject(Services.USERS_MS) private readonly users: ClientProxy,
    @Inject(Services.SERVICES_MS) private readonly services: ClientProxy,
    @Inject(Services.PAYMENTS_MS) private readonly payments: ClientProxy,
  ) {}
  async getTopCustomers() {
    const customers: TopCustomers = await firstValueFrom(
      this.appointments.send('get-top-customers', {}).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )

    const validCustomers = customers.filter((c) => c.customerId !== 0)

    const ids = validCustomers.map((c) => c.customerId)
    const data = await firstValueFrom(
      this.users.send('get-customers-by-ids', { ids }).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )

    const merged = validCustomers.map((c) => {
      const customer = data.find((d) => d.id === c.customerId)
      return {
        ...customer,
        totalAppointments: c._count.customerId,
      }
    })

    return merged
  }

  async getCustomersPerMonth() {
    const customers = await firstValueFrom(
      this.users.send('get-customers-per-month', {}).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )
    return customers
  }

  async getTopServices() {
    const services: TopServices = await firstValueFrom(
      this.appointments.send('get-top-services', {}).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )

    const validServices = services.filter((s) => s.serviceId !== 0)

    const ids = validServices.map((s) => s.serviceId)

    const data = await firstValueFrom(
      this.services.send('get-services-by-ids', { ids }).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )

    const merged = validServices
      .map((s) => {
        const service = data.find((d) => d.id === s.serviceId)
        if (!service) return null
        return {
          ...service,
          totalAppointments: s._count.serviceId,
        }
      })
      .filter(Boolean)
    return merged
  }

  async getTopBarbers() {
    const barbers: TopBarbers = await firstValueFrom(
      this.appointments.send('get-top-barbers', {}).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )

    const validBarbers = barbers.filter((b) => b.barberId !== 0)

    const ids = validBarbers.map((b) => b.barberId)

    const data = await firstValueFrom(
      this.users.send('get-barbers-by-ids', { ids }).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )

    const merged = validBarbers
      .map((b) => {
        const barber = data.find((d) => d.id === b.barberId)
        if (!barber) return null
        return {
          ...barber,
          totalAppointments: b._count.barberId,
        }
      })
      .filter(Boolean)

    return merged
  }

  async getPaymentsAnalytics() {
    const payments = await firstValueFrom(
      this.payments.send('get-payments-analytics', {}).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )
    return payments
  }

  async getPaymentsAnalyticsSummary() {
    const summary = await firstValueFrom(
      this.payments.send('get-payments-analytics-summary', {}).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )
    return summary
  }
  async getServicesPercentage() {
    const percentage = await firstValueFrom(
      this.services.send('get-services-percentage', {}).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )
    return percentage
  }
  async getBarbersPercentage() {
    const percentage = await firstValueFrom(
      this.users.send('get-barbers-percentage', {}).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )
    return percentage
  }
  async getCustomersRegistered() {
    const registered = await firstValueFrom(
      this.users.send('get-customers-registered', {}).pipe(
        catchError((e) => {
          throw new RpcException(e)
        }),
      ),
    )
    return registered
  }
}
