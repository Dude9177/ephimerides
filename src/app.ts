import { autoinject, LogManager } from 'aurelia-framework'
import { Ephimeride } from 'shared/models/ephimeride-model'
import { DateTimeService } from 'shared/services/date-time-service'
import { EphimeridesService } from 'shared/services/ephimeride-service'
import '../styles/styles.scss'

const logger = LogManager.getLogger('app')

@autoinject()
export class App {
  public ephimerides: Ephimeride[] = []
  public message: string = 'Ephimeriden Wien'
  public showList: boolean = true

  public today: Date = new Date()
  public actualEphimeride: Ephimeride

  public date: Date = new Date()

  public hideOuterRange: boolean
  public diffDelta: number = 2

  constructor(
    private ephimeridesService: EphimeridesService,
    private dateTimeService: DateTimeService
  ) {
  }

  async activate() {
    this.ephimerides = await this.ephimeridesService.get('Wien', 2020)
    this.actualEphimeride = this.ephimerides.find(e => this.dateTimeService.equals(e.tag, this.today))

    this.ephimerides.forEach(e => {
      e.tagDiff = this.dateTimeService.getDiff(e.tag, this.actualEphimeride.tag, 'days')
      e.tageslaengeDiff = e.tageslaenge - this.actualEphimeride.tageslaenge
      e.sonnenaufgangDiff = e.sonnenaufgangMinutes() - this.actualEphimeride.sonnenaufgangMinutes()
      e.sonnenuntergangDiff = e.sonnenuntergangMinutes() - this.actualEphimeride.sonnenuntergangMinutes()
    })

    logger.debug('date', this.date)
  }

  highlightClass(e: Ephimeride, delta: number = null) {
    delta = delta || this.diffDelta || 2
    const absTageslaengeDiff = Math.abs(e.tageslaengeDiff)
    const absSonnenaufgangDiff = Math.abs(e.sonnenaufgangDiff)
    const absSonnenuntergangDiff = Math.abs(e.sonnenuntergangDiff)
    if (absTageslaengeDiff > delta && absSonnenaufgangDiff > delta && absSonnenuntergangDiff > delta) {
      return
    }

    return 'is-highlighted'
  }

  highlightLevel(diff: number, delta: number = null) {
    const absDiff = Math.abs(diff)
    return 'highlight-level-' + absDiff.toString()
  }

  isTodayClass(e: Ephimeride) {
    return this.dateTimeService.equals(e.tag, this.actualEphimeride.tag) ? 'is-today' : ''
  }
}
