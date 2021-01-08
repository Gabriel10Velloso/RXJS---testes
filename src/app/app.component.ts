import { Component, OnInit } from '@angular/core';
import { interval, merge, Observable, of } from 'rxjs';
import { tap, catchError, delay, take, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

interface jsonStruct {
  results: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'teste-unitario';

  combinedAtEnd: jsonStruct[] = [];
  realTime: jsonStruct[] = []; // évite le new


  ngOnInit() {

    // Time Out
    let source = interval(1000).pipe(
      map(res=>{
        return 1
      }),
      take(2));
    let source1 = interval(100).pipe(
      map(res=>{
        return 2
      }),
      take(1));
    let source2 = interval(500).pipe(
      map(res=>{
        return 3
      }),
      take(1));

    const plusTime = merge(source, source1, source2)

   const a =  plusTime.subscribe(res=>{
      console.log('--->', res)
    })

    console.log('SUBSCRIBE ABERTO', a);
    setTimeout(function(){   console.log('SUBISCRIBE FECHADO', a); }, 5000);

  }


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

      forkJoin(obsArray).subscribe(res => {
        //this.combined = [res[0], res[1], res[2]];
        // res est déjà un tableau:
        this.combinedAtEnd = res;
      });
  }

}
