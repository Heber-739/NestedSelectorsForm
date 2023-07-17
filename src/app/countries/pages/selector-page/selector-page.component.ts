import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContriesService } from '../../services/contries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import {filter, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {
  public countriesByRegion: SmallCountry[]=[];
  public borders: SmallCountry[]=[];

  public formSelectors: FormGroup = this.fb.group({
    region:['', Validators.required],
    country:['', Validators.required],
    border:['', Validators.required],
  })


  constructor( private fb:FormBuilder,
    private contriesService:ContriesService) { }

  ngOnInit(): void {
    this.onRegionChanged()
    this.onCountryChanged()
  }

  get regions():Region[]{
    return this.contriesService.contries
  }

  onRegionChanged():void{
    this.formSelectors.get('region')?.valueChanges.pipe(
      tap(()=> this.formSelectors.get('country')?.setValue('')),
      filter((reg:Region) => reg.length > 0 ),
      tap(()=>this.borders = []),
      switchMap(region => this.contriesService.getCountriesByRegion(region))
    )
    .subscribe({
      next: (res)=> this.countriesByRegion = res
    })
  }

  onCountryChanged():void{
    this.formSelectors.get('country')?.valueChanges.pipe(
      tap(()=> this.formSelectors.get('border')?.setValue('')),
      filter((value:string) => value.length > 0 ),
      switchMap(alphaCode => this.contriesService.getCountryByAlphaCode(alphaCode)),
      switchMap(country => this.contriesService.getCountryBordersByCode(country.borders))
    )
    .subscribe({
      next: (countries)=> this.borders = countries
    })
  }

}
