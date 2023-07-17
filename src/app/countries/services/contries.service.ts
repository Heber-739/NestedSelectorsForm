import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContriesService {

  private url: string = 'https://restcountries.com/v3.1';

  private _regions: Region[] = [
    Region.Africa, Region.America, Region.Asia,
    Region.Europe, Region.Oceania
  ]

  constructor(private http:HttpClient) { }


  get contries ():Region[]{
    return [...this._regions];
  }

  getCountriesByRegion(region:Region):Observable<SmallCountry[]>{
    if(!region) return of([]);

    const url: string = `${this.url}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url).pipe(
      map(countries => countries.map(country => ({
        name:country.name.common,
        cca3: country.cca3,
        borders: country.borders??[],
      }))),
    )
  }

  getCountryByAlphaCode(alphaCode: string):Observable<SmallCountry>{
    const url = `${this.url}/alpha/${alphaCode}?fields=cca3,name,borders`
    return this.http.get<Country>(url).pipe(
      map((country => ({
        name:country.name.common,
        cca3: country.cca3,
        borders: country.borders??[],
      }))),
      tap(res => console.log(res))
    )
  }

  getCountryBordersByCode(borders: string[]):Observable<SmallCountry[]>{
    if(borders.length===0) return of([]);
    const countriesRequest:Observable<SmallCountry>[] = []
    borders.forEach((border)=>{
      const request =this.getCountryByAlphaCode(border)
      countriesRequest.push(request)
    })
    return combineLatest(countriesRequest)
  }


}
