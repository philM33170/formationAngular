import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PropertiesService } from '../services/properties.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  properties: any = [];
  propertiesSubscription: Subscription;

  constructor(private propertiesService: PropertiesService) {}

  ngOnInit(): void {
    this.propertiesSubscription = this.propertiesService.propertiesSubject.subscribe({
      next: (data) => this.properties = data,
      error: (e) => console.log(e),
      //complete: () => console.log("Observable complete !")
    })
    this.propertiesService.getProperties();
    this.propertiesService.emitProperties();
  }

  ngOnDestroy(): void {
      this.propertiesSubscription.unsubscribe();
  }

  getSoldValue(index: number) {
    if(this.properties[index].sold) {
      return "red";
    } else {
      return "green";
    }
  }

}
