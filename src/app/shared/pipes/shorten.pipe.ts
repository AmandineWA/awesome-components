import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'shorten'
})

export class ShortenPipe implements PipeTransform {
  // raccourcie un text à 50 caractère par default. Le nombre de caractère peut_etre modifier dans le html
  transform(value: string, maxLength = 50): string {
    if (value.length <= maxLength){
      return value
    }
    return value.substring(0,maxLength) + '...';
  }

}
