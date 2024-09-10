export class NumberUtils {
  static currencyFormat(value: any) {
    if (value) {
     value = value.toString();
     value =  value.length > 1 ? value.replace(/^0+/, '') : value;
     return  value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    return null;
  }

  static convertCurrencyToNumber(value: any): number {
    if (value) {
      return Number(value.toString().replace(/,/g, ''));
    }
    return null;
  }

  static getMoneyStr(value: number, decimalDigit: number = 0) {
    if (value == 0 || value == null || value == undefined) {
      return '0';
    }
    const valueABS = Math.abs(value);

    const pow = Math.pow(10, decimalDigit);
    const val = Math.ceil(valueABS * pow) / pow;
    const s: string = val.toString();
    let s2 = '';
    let j = s.indexOf('.');
    if (j > -1) {
      s2 = s.substring(j);
    } else {
      j = s.length;
    }

    while (j > 3) {
      s2 = '.' + s.substring(j - 3, j) + s2;
      j -= 3;
    }
    s2 = s.substring(0, j) + s2;
    if (value < 0) {
      s2 = '- ' + s2;
    }
    return s2;
  }
}
