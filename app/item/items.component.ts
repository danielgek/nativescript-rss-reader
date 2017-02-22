import { Component, OnInit } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import { Observable } from 'rxjs/Observable';

import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    items: any;

    constructor(private itemService: ItemService, private routerExtensions: RouterExtensions) { }

    ngOnInit(): void {
        this.itemService.getNews()
            .map(result => result.articles)
            .subscribe((result) => {
                console.log('result',result);
                this.items = result
            });
    }

    goToDetail(item) {
        //console.log(JSON.stringify(item));
         this.routerExtensions.navigate(["/item", { article: JSON.stringify(item) }]);
    }
    
}
