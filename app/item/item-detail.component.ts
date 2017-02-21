import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Item } from "./item";
import { ItemService } from "./item.service";
import "rxjs/add/operator/switchMap";
import { RouterExtensions, PageRoute } from 'nativescript-angular/router';
@Component({
    selector: "ns-details",
    moduleId: module.id,
    templateUrl: "./item-detail.component.html",
    styles: [`
        .title{
            font-size: 25;
            color: black;

        }

        .description {
            font-size: 20;
        }
    
    `]
})
export class ItemDetailComponent implements OnInit {
    article: any;

    constructor(
        private pageRoute: PageRoute,
        private routerExtensions: RouterExtensions,
        private itemService: ItemService,
        private route: ActivatedRoute
    ) {

         
     }

  
    ngOnInit(): void {
        this.pageRoute.activatedRoute
            .switchMap(activatedRoute => activatedRoute.params)
            .map((params) => {  return JSON.parse(params['article']); })
            .subscribe((article) => {

                //console.log(JSON.stringify(article));
                this.article = article;
            });
    }


     back() {
        this.routerExtensions.backToPreviousPage();
    }
}
