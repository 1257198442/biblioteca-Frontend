import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCardNumber]'
})
export class CardNumberDirective {
  constructor(private el: ElementRef) {}
  @HostListener('input', ['$event']) onInput(event: any): void {
    const input = event.target;
    const value = input.value.replace(/\D/g, '');
    const formattedValue = this.formatCardNumber(value);
    input.value = formattedValue;
  }

  private formatCardNumber(value: string): string {
    const groups = value.match(/\d{1,4}/g);
    if (groups) {
      return groups.join(' '); // 使用空格连接组
    }
    return value;
  }
}
