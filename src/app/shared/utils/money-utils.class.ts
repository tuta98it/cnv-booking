export class MoneyUtils {

  static formatCurrencyVND(value: any) {
    if (!value) {
      return '0 đ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  }
}
