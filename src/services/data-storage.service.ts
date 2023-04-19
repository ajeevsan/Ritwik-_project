import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  dataFromDB: Array<any>;
  constructor() { }
}
