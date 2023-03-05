import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, Form, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-test-input',
  templateUrl: './test-input.component.html',
  styleUrls: ['./test-input.component.css']
})
export class TestInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() passwordType = 'password';
  @Input() placeholder = '';
  @Input() iconHide = true;
  @Input() types = !this.iconHide && this.passwordType === 'password' ? 'password' : 'text';
  constructor(@Self() public ngControl: NgControl){
    this.ngControl.valueAccessor = this;
  }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  onEyeClick(isClick: boolean) {
    this.types = !this.iconHide && this.passwordType === 'password' ? 'password' : 'text'
    this.iconHide = !isClick
  }

}
