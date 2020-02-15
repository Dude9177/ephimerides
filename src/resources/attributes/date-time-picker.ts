import { autoinject, bindable, bindingMode, customAttribute, LogManager } from 'aurelia-framework'
import bulmaCalendar from 'bulma-extensions/bulma-calendar/dist/js/bulma-calendar'
import { DateTimeService } from 'shared/services/date-time-service'

const logger = LogManager.getLogger('date-time-picker')

@customAttribute('date-time-picker')
@autoinject()
export class DateTimePicker {
  dateFormat: string = 'DD.MM.YYYY'
  element: HTMLInputElement

  @bindable({ defaultBindingMode: bindingMode.twoWay }) date: Date

  constructor(
    element: Element,
    private dateTimeService: DateTimeService
  ) {
    this.element = element as HTMLInputElement
  }

  attached() {
    const startDate = this.date && this.dateTimeService.toLocalDate(this.date)

    const options = {
      lang: 'de',
      dateFormat: this.dateFormat,
      weekStart: 1,
      startDate,
      onSelect: x => logger.debug('x', x),
      onChange: y => logger.debug('y', y)
    }
    bulmaCalendar.attach(this.element, options)

    this.element['bulmaCalendar'].on('select', datepicker => {
      const val = datepicker.data.value()
      this.date = this.dateTimeService.stringToDate(val, this.dateFormat)
    })

    const clearButton = this.element.parentElement.parentElement
      .querySelector('.datetimepicker-clear-button')

    clearButton.setAttribute('type', 'button')
    clearButton.addEventListener('click', () => {
      this.date = null
    })
  }
}
