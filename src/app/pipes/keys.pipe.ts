import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys',
  standalone:false
})
export class KeysPipe implements PipeTransform {

  transform(value: object, ...args: unknown[]): string {
   
   		let key = Object.keys(value).toString();

   		return key; 
  }

}
