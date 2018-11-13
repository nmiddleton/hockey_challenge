import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {TeamPerformance} from './team-performance';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ServiceHelpers} from './service-helpers';


const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class TeamPerformanceService {

  constructor(
    private http: HttpClient) { }

  public getTeamPerformance(): Observable<TeamPerformance[]> {
    return this.http.get<TeamPerformance[]>(API_URL + '/team_performance')
      .pipe(
        catchError(ServiceHelpers.handleErrorAndContinue('get team_performance', []))
      );
  }
  public getTeamPerformanceFor(team?: string): Observable<TeamPerformance> {
    return this.http.get<any>(API_URL + '/team_performance/' + team)
      .pipe(
        catchError(ServiceHelpers.handleErrorAndContinue('get team_performance for ' + team, []))
      );
  }
}
