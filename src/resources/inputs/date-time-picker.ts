import { autoinject, bindable, customAttribute, LogManager } from 'aurelia-framework'
import { DateTimeService } from 'shared/services/date-time-service'
import bulmaCalendar from '../../../node_modules/bulma-extensions/bulma-calendar/dist/js/bulma-calendar.js'

const logger = LogManager.getLogger('date-time-picker')

@customAttribute('date-time-picker')
@autoinject()
export class DateTimePicker {
  @bindable
  public date: Date

  private dateString: string

  constructor(
    private element: Element,
    private dateTimeService: DateTimeService
    ) {

  }

  attached() {
    this.dateString = this.dateTimeService.format(this.date, 'DD.MM.YYYY')
    logger.debug('date string', this.dateString)
    const options = {
      lang: 'de',
      dateFormat: 'DD.MM.YYYY',
      weekStart: 1,
      startDate: this.dateTimeService.toLocalDate(this.date)
    }
    bulmaCalendar.attach(this.element, options)
    logger.debug('attached', this.date)
  }

  valueChanged() {
    logger.debug('date changed', this.date)
  }
}
