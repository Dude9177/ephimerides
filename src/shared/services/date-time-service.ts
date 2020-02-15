import { LogManager } from 'aurelia-framework'
import * as moment from 'moment'
import 'moment/locale/de-at'

const logger = LogManager.getLogger('date time service')

export class DateTimeService {
  constructor() {
    moment.locale('de')
  }

  public format(dateTime: Date, format: string = 'LLLL') {
    const returnValue = moment(dateTime).format(format)
    return returnValue
  }

  public stringToDate(date: string, format: string = '') {
    return moment(date, format).toDate()
  }

  public toDate(tag: number, monat: string, jahr: number, uhrzeit: string) {
    const dateString = `${tag}. ${monat} ${jahr}, ${uhrzeit}`
    const momt = moment(dateString)
    return momt.toDate()
  }

  public toLocalDate(date: Date) {
    return moment(date).toDate()
  }

  public equals(d1: Date, d2: Date) {
    const m1 = moment(d1)
    const m2 = moment(d2)
    const returnValue = m1.isSame(m2, 'day')
    return returnValue
  }

  public getDiff(d1: Date, d2: Date, diffType: string = 'days') {
    const m1 = moment(d1)
    const m2 = moment(d2)
    const returnValue = m2.diff(m1, diffType as moment.unitOfTime.Diff)
    return returnValue
  }
}
