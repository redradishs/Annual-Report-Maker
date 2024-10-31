import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any): string {
    const now = new Date().getTime();
    const past = new Date(value).getTime();
    const secondsAgo = Math.floor((now - past) / 1000);

    if (secondsAgo < 60) {
      return 'Just now';
    } else if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 2592000) {
      const days = Math.floor(secondsAgo / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 31104000) {
      const months = Math.floor(secondsAgo / 2592000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(secondsAgo / 31104000);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }
}
