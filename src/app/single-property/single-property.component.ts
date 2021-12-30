import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../interfaces/property';
import { PropertiesService } from '../services/properties.service';

@Component({
  selector: 'app-single-property',
  templateUrl: './single-property.component.html',
  styleUrls: ['./single-property.component.css']
})
export class SinglePropertyComponent implements OnInit {

  property: Property;

  constructor(private route: ActivatedRoute, private propertiesService: PropertiesService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];
    this.propertiesService.getSingleProperties(id)
                          .then((data: Property) => {
                               this.property = data;
                          })
                          .catch((error) => {
                            console.error(error);
                          })

  }

}
