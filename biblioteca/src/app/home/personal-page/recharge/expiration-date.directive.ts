import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appExpirationDate]'
})
export class ExpirationDateDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any): void {
    const input = event.target;
    const value = input.value.replace(/\D/g, '');
    const formattedValue = this.formatCardNumber(value);
    input.value = formattedValue;
  }

  private formatCardNumber(value: string): string {
    const groups = value.match(/\d{1,2}/g);
    if (groups) {
      return groups.join('/');
    }
    return value;
  }
}
