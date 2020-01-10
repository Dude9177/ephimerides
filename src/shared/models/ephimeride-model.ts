import { autoinject } from 'aurelia-framework'
import { AbstractFactory } from 'shared/models/abstract-factory'
import { DateTimeService } from 'shared/services/date-time-service'

export interface IEphimeride {
  stadt: string,
  tag: number,
  monat: string,
  jahr: number,
  sonnenaufgang: string,
  sonnenuntergang: string,
  mondaufgang: string,
  monduntergang: string
}

export class Ephimeride {
  public tagDiff: number  = 0
  public tageslaengeDiff: number = 0
  public sonnenaufgangDiff: number = 0
  public sonnenuntergangDiff: number = 0
  
  constructor(
    public stadt: string = '',
    public tag: Date = null,
    public sonnenaufgang: Date = null,
    public sonnenuntergang: Date = null,
    public tageslaenge: number = 0
  ) { }

  sonnenaufgangMinutes() {
    return this.sonnenaufgang.getHours() * 60 + this.sonnenaufgang.getMinutes()
  }

  sonnenuntergangMinutes() {
    return this.sonnenuntergang.getHours() * 60 + this.sonnenuntergang.getMinutes()
  }

  get minDiff() {
    return Math.min(Math.abs(this.tagDiff), Math.abs(this.tageslaengeDiff), Math.abs(this.sonnenaufgangDiff), Math.abs(this.sonnenuntergangDiff))
  }
}

// tslint:disable-next-line: max-classes-per-file
@autoinject()
export class EphimerideFactory extends AbstractFactory<Ephimeride> {
  constructor(
    private dateTimeService: DateTimeService
  ) {
    super()
  }

  public create(model: IEphimeride) {
    const monat = this.getMonat(model.monat)
    const tag = new Date(model.jahr, monat - 1, model.tag)
    const sonnenaufgangTime = model.sonnenaufgang.split(':').map(s => Number.parseInt(s, 10))
    const sonnenuntergangTime = model.sonnenuntergang.split(':').map(s => Number.parseInt(s, 10))

    const sonnenaufgang = new Date(model.jahr, monat - 1, model.tag, sonnenaufgangTime[0], sonnenaufgangTime[1])
    const sonnenuntergang = new Date(model.jahr, monat - 1, model.tag, sonnenuntergangTime[0], sonnenuntergangTime[1])

    const tageslaenge = this.dateTimeService.getDiff(sonnenaufgang, sonnenuntergang, 'minutes')

    return new Ephimeride(
      model.stadt, tag, sonnenaufgang, sonnenuntergang, tageslaenge
    )
  }

  public empty() {
    return new Ephimeride()
  }

  private getMonat(monat: string) {
    switch (monat) {
      case 'Jänner': return 1
      case 'Februar': return 2
      case 'März': return 3
      case 'April': return 4
      case 'Mai': return 5
      case 'Juni': return 6
      case 'Juli': return 7
      case 'August': return 8
      case 'September': return 9
      case 'Oktober': return 10
      case 'November': return 11
      case 'Dezember': return 12
    }
  }
}
