import {
  AfterContentInit,
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { LazyLoadScriptService } from './lazy-load-script.service';
import { map, filter, take, switchMap } from 'rxjs/operators';

declare var $;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private lazyLoadService: LazyLoadScriptService) {}

  ngAfterContentInit() {
    this.lazyLoadService
      .loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'
      )
      .pipe(
        map((_) => 'jQuery is loaded'),
        filter((jquery) => !!jquery),
        take(1),
        switchMap((_) =>
          this.lazyLoadService.loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js'
          )
        )
      )
      .subscribe((_) => {
        $('.slick-container').slick({
          dots: true,
          infinite: true,
          speed: 400,
          slidesToShow: 1,
          slidesToScroll: 1,
        });
      });
  }
}
