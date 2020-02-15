import { autoinject, LogManager, observable } from 'aurelia-framework'
import * as Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more.js'
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

  public chart: Highcharts.Chart
  private chartCategories: string[]

  @observable()
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
    this.calculateHighlighted()
  }

  calculateHighlighted() {
    this.actualEphimeride = this.ephimerides.find(e => this.dateTimeService.equals(e.tag, this.date))

    this.ephimerides.forEach(e => {
      e.tagDiff = this.dateTimeService.getDiff(e.tag, this.actualEphimeride.tag, 'days')
      e.tageslaengeDiff = e.tageslaenge - this.actualEphimeride.tageslaenge
      e.sonnenaufgangDiff = e.sonnenaufgangMinutes() - this.actualEphimeride.sonnenaufgangMinutes()
      e.sonnenuntergangDiff = e.sonnenuntergangMinutes() - this.actualEphimeride.sonnenuntergangMinutes()
      e.isHighlighted = this.dateTimeService.equals(e.tag, this.actualEphimeride.tag)
    })
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

  dateChanged() {
    logger.debug('date changed', this.date)
    this.calculateHighlighted()
    if (this.chart) {
      this.setPlotband()
    }
  }

  setPlotband() {
    const dateIndex = this.chartCategories.indexOf(this.date.toLocaleDateString())
    const plotBand = {
      id: 'today',
      from: dateIndex - 0.5,
      to: dateIndex + 0.5,
      color: 'rgba(255, 50, 50, .7)'
    }
    this.chart.xAxis[0].removePlotBand('today')
    this.chart.xAxis[0].addPlotBand(plotBand)
  }

  attached() {
    const tagesrange = this.ephimerides.map((e, i) => {
      const sonnenaufgang = e.sonnenaufgang
      const sonnenuntergang = e.sonnenuntergang
      sonnenaufgang.setFullYear(2000, 1, 1)
      sonnenuntergang.setFullYear(2000, 1, 1)
      return [i, sonnenaufgang.getTime(), sonnenuntergang.getTime()]
    })

    this.chartCategories = this.ephimerides.map(e => e.tag.toLocaleDateString())

    const dateIndex = this.chartCategories.indexOf(this.date.toLocaleDateString())

    HighchartsMore(Highcharts)

    this.chart = Highcharts.chart('chartDiv', {
      chart: {
        type: 'arearange',
        inverted: true,
        plotBackgroundColor: '#00003f',
        animation: false
      },
      title: {
        text: 'Tagesverlauf'
      },
      xAxis: {
        categories: this.chartCategories
      },
      yAxis: {
        type: 'datetime',
        min: new Date(2000, 1, 1, 1, 1, 0).getTime(),
        max: new Date(2000, 1, 1, 23, 59, 59).getTime(),
        title: { text: 'Stunden' },
        startOnTick: false,
        endOnTick: false
      },
      series: [
        {
          name: 'Tageslänge',
          type: 'arearange',
          data: tagesrange,
          color: '#ffea00',
          tooltip: {
            pointFormatter() {
              const lowerDate = new Date(this.low)
              const upperDate = new Date(this.high)
              const lower = lowerDate.getHours() + ':' + String(lowerDate.getMinutes()).padStart(2, '0')
              const upper = upperDate.getHours() + ':' + String(upperDate.getMinutes()).padStart(2, '0')
              return `Sonnenaufgang: ${lower} Uhr<br/>Sonnenuntergang: ${upper} Uhr`
            }
          }
        }
      ]
    })

    this.setPlotband()
  }
}
