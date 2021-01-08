import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError, delay } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

interface jsonStruct {
  results: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'teste-unitario';

  combinedAtEnd: jsonStruct[] = [];
  realTime: jsonStruct[] = []; // évite le new


  ngOnInit() {  }

  testForkJoin() {

    const obs1 = of({ results: "one" }).pipe(
      tap(res => {
        this.realTime.push(res);
      }));

    const obs2 = of({ results: "tow" }).pipe(
      delay(1000),
      tap(res => {
        this.realTime.push(res);
      }));

    const obs3 = of({ results: "tree" }).pipe(
      delay(5000),
      tap(res => {
        this.realTime.push(res);
      }));

    const obs4 = of({ results: "four" }).pipe(
      tap(res => {
        this.realTime.push(res)
      }),
      catchError(error => {
        this.realTime.push({ results: error });
        return of(error);
      }));

      const obsArray: Observable<jsonStruct>[] = [];
      obsArray.push(obs1, obs2, obs3, obs4);
      console.log(obsArray)

      forkJoin(obsArray).subscribe(res => {
        //this.combined = [res[0], res[1], res[2]];
        // res est déjà un tableau:
        this.combinedAtEnd = res;
      });
  }

}
