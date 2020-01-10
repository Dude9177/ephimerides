import { autoinject } from 'aurelia-framework'
import { DateTimeService } from 'shared/services/date-time-service'

@autoinject()
export class DateTimeValueConverter {
  constructor(
    private dateTimeService: DateTimeService
  ) {}

  toView(value: Date, format: string = 'LLLL') {
    return this.dateTimeService.format(value, format)
  }
}
