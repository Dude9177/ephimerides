export class TimeValueConverter {
  toView(value: number) {
    const hours = Math.floor(value / 60)
    const minutes = value % 60
    return `${hours} h ${minutes} m`
  }
}
