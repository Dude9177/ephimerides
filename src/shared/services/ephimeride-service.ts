import { autoinject } from 'aurelia-framework'
import { Ephimeride, EphimerideFactory, IEphimeride } from 'shared/models/ephimeride-model'
import * as ephemeriden from '../../../static/ephimeriden_wien_2020.json'

@autoinject()
export class EphimeridesService {
  constructor(
    private factory: EphimerideFactory
  ) {}

  public async get(stadt: string, jahr: number): Promise<Ephimeride[]> {
    const ephimerides = ephemeriden.map(e => this.factory.create(e as IEphimeride))
    ephimerides.forEach(e => e.stadt = 'Wien')
    return Promise.resolve(ephimerides)
  }
}
