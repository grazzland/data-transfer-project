import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { PortableDataType } from './portable-data-type';
import { ServiceDescription, ServiceDescriptions } from './service-description';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SelectDataTypeService {
  private baseEndpoint = "http://localhost:8080/_/";
  constructor(private http: Http) { }

  listDataTypes() {
    let url = `${this.baseEndpoint}listDataTypes`;
    return this.http.get(url)
      .map(this.listDataTypesSuccess)
      .catch(this.handleError);
  }

  listServices(dataType: string) {
    let params = new URLSearchParams();
    params.set('search', dataType);
    let url = `${this.baseEndpoint}listServices`;
    return this.http.get(url, params)
      .map(this.listServicesSuccess)
      .catch(this.handleError);
  }

  private listDataTypesSuccess(res: Response) {
    console.log('listDataTypesSuccess, res: ' + JSON.stringify(res));
    let body = res.json();
    console.log('listDataTypesSuccess, body: ' + JSON.stringify(body));
    let dataTypes: PortableDataType[] = [];
    for (var prop in body) {
      dataTypes.push(new PortableDataType(prop, body[prop]));
    }
    console.log('listDataTypesSuccess, dataTypes: ' + JSON.stringify(dataTypes));
    return dataTypes;
  }

  private listServicesSuccess(res: Response) {
    console.log('listServicesSuccess, res: ' +  JSON.stringify(res));
    let body = res.json();
    console.log('listServicesSuccess, json from backend:' + JSON.stringify(body));
    let importServices: ServiceDescription[] = [];
    let importData = body['import'];
    for (var name in importData) {
      importServices.push(new ServiceDescription(name, importData[name]));
    }
    console.log('listServicesSuccess, importServices: ' + JSON.stringify(importServices));
    let exportServices: ServiceDescription[] = [];
    let exportData = body['export'];
    for (var name in exportData) {
      exportServices.push(new ServiceDescription(name, exportData[name]));
    }
    console.log('listServicesSuccess, exportServices: ' + JSON.stringify(exportServices));
    return new ServiceDescriptions(importServices, exportServices);
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errorMessage: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errorMessage = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errorMessage = error.message ? error.message : error.toString();
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }
}