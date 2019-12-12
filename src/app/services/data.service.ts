import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  
  getDataToRandom() {
    return localStorage.getItem('randomData');
  }

  setDataToRandom(objects): void {
    localStorage.setItem('randomData', JSON.stringify(objects));
  }

  getDataToDikRandom() {
    return localStorage.getItem('dikRandomData');
  }

  setDataToDikRandom(objects): void {
    localStorage.setItem('dikRandomData', JSON.stringify(objects));
  }

  getConfig() {
    return localStorage.getItem('dikConfig');
  }

  setConfig(object): void {
    localStorage.setItem('dikConfig', JSON.stringify(object));
  }


  
  setDefaultDataDik(): void {
    let listObj = [];

    for (let i = 1; i <= 150; i++) {
      switch (i.toString().length) {
        case 1:
          listObj.push({ name: "00" + i.toString(), lucky: false, timeStamp: "" });
          break;

        case 2:
          listObj.push({ name: "0" + i.toString(), lucky: false, timeStamp: "" });
          break;
        default:
          listObj.push({ name: i.toString(), lucky: false, timeStamp: "" });
          break;
      }
    }
    this.setDataToDikRandom(listObj);
  }

  formatDateTime(date) {
    var d = new Date(date);

    return [d.getMonth() + 1,
    d.getDate(),
    d.getFullYear()].join('/') + ' ' +
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
  }
}
