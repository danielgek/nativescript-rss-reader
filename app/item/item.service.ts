import { Injectable } from "@angular/core";

import { Item } from "./item";

// import { XmlParser, ParserEvent, ParserEventType } from "xml";
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { parse, XElement, XComment, XText, XCData, XAttribute } from 'nativescript-xmlobjects';

// import { parser } from 'rss-parser';
import { parseString } from 'nativescript-xml2js';



@Injectable()
export class ItemService {
    private items = new Array<Item>(
        { id: 1, name: "Ter Stegen", role: "Goalkeeper" },
       
    );


    constructor(private _http: Http) {
        this.getNews();
    }

    getItems(): Item[] {
        return this.items;
    }

    getItem(id: number): Item {
        return this.items.filter(item => item.id === id)[0];
    }

    getNews(): Observable<rssResult> {
        return this._http.get(`http://feeds.feedburner.com/AndroidPolice?format=xml`)
            .map((response:Response ) =>  response.text())
            .map(response => this.parseXml(response))
            .catch(this.handleError);
            
    }


    private parseXml(xmlString: string){

        let rootElement = parse(xmlString).root;

        let result: rssResult = {
            title: rootElement.element('channel').element('title').value,
            link: rootElement.element('channel').element('link').value,
            articles: []
        }
       
        let articles =  rootElement.element('channel').elements('item');

        articles.forEach((item: XElement, index: number) => {
            let hasImage = false;
            let imageUrl: string;
            let description: string = '';
            let tags: Array<string> = [];

            let content = parse( '<div>' + item.element('description').value + '</div>').root.elements('p')
            content.forEach((itemContent: XElement, index: number) => {
                try {
                    if((<string>itemContent.value).charAt(0) === '<' && (<string>itemContent.value).length > 0 && (<string>itemContent.value).charAt((<string>itemContent.value).length-1) === '>'){
                            let parsedContent = parse( itemContent.value).root;
                            if(parsedContent && parsedContent.name.equals('img') ){
                                console.log('found image')
                                if(parsedContent.attribute('src') && !hasImage){
                                    imageUrl = parsedContent.attribute('src').value;
                                    hasImage = true;
                                    console.log(imageUrl);  
                                }
                            }    
                    }else{
                        description = description + '' + (<string>itemContent.value).replace(/(<([^>]+)>)/, "");
                    }
                } catch (error) {
                    console.log('error on parcing') 
                    console.log(itemContent.value); 
                }
            });
            result.articles.push({
                title: item.element('title').value,
                link: item.element('link').value,
                description: description,
                pubDate: item.element('pubDate').value,
                img: imageUrl,
                tags: item.elements('category').map(element => element.value),
                author: item.element('dc:creator').value
                
            });
        });

        return result; 
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || "";
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }


    

}

interface rssResult {
    title: string;
    link: string;
    articles: Array<Post>
}

interface Post {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    img: string;
    author: string;
    tags: Array<string>;
}