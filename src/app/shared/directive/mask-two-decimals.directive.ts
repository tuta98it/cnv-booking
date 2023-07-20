import {Directive, HostListener, ElementRef} from '@angular/core';

@Directive({
  selector: 'input[appMaskTwoDecimals]'
})
export class MaskTwoDecimalsDirective {
  readonly decimals: number = 2;
  private regex: RegExp = new RegExp(/^[0-2](\.\d{0,2})?$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(this.el.nativeElement.value);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    } else if (next && String(next).match(this.regex)) {
      if (Number(next) > 2) {
        event.preventDefault();
      }
    }
  }
  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^0-9\\.]*/g, '');
    if ( initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
