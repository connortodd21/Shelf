import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'UsernameFilter'
})
export class UsernameFilter implements PipeTransform {

    transform(items: any[], value: string, label: string): any[] {
        if (!items) { return []; }
        if (!value) { return []; }
        if (value === '' || value == null) { return []; }
        return items.filter(e => e.username.toLowerCase().indexOf(value) > -1);
    }
}
