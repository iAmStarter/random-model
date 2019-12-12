import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

export interface RandomElement {
  name: string;
  lucky: boolean;
  delete: boolean;
}

let toSaveList: RandomElement[] = [];


@Component({
  selector:'app-random',
  templateUrl:'./random.component.html',
  styleUrls:['./random.component.css']
})

export class RandomComponent implements OnInit {
  randomList: RandomElement[] = [];

  randomTimes = 0;
  randomItem: any = null;
  randomClicked = false;
  randomSuccess = false;
  successList: any = [];
  countDownVal: number = 5;
  listRandomData: RandomElement[] = [];
  listCountTime = [];
  constructor(public dialog: MatDialog, private router: Router, private dataService: DataService) {

  }

  ngOnInit() {
    this.randomList = [];
    toSaveList = [];
    setTimeout(() => {
      let data = this.dataService.getDataToRandom();
      if (data != null) {
        toSaveList = JSON.parse(data);
        for (let index = 0; index < toSaveList.length; index++) {
          if (toSaveList[index].lucky == false) {
            this.randomList.push(toSaveList[index]);
          }
        }
      }
    }, 20);
  }

  submit() {
    if (this.randomList.length <= 0) {
      this.openRandomDataDialog();
    } else if (this.randomSuccess) {
      this.save();
    } else {
      this.ClickRandom();
    }
  }

  ClickRandom() {
    this.randomClicked = true;
    this.randomSuccess = false;
    setTimeout(() => {
      this.Random();
    }, 50);
  }

  Random() {
    let interval = setInterval(() => {
      let indexId = Math.floor((Math.random() * this.randomList.length));
      this.randomItem = this.randomList[indexId];
    }, 20);

    setTimeout(() => {
      for (let index = 0; index < toSaveList.length; index++) {
        if (toSaveList[index].name == this.randomItem.name) {
          toSaveList[index].lucky = true;
        }
      }

      this.randomTimes--;
      clearInterval(interval);

      if (this.randomTimes > -1) {
        this.Random();
      } else {
        this.randomClicked = false;
        this.randomSuccess = true;
      }

    }, (this.countDownVal * 1000));
  }

  save() {
    this.randomClicked = false;
    this.randomSuccess = false;
    this.randomItem = null;
    this.dataService.setDataToRandom(toSaveList);
    this.ngOnInit();
  }

  openTimeDialog(): void {
    const dialogRef = this.dialog.open(TimeDialog, {
      width: '95%',
      data: { countDownVal: this.countDownVal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.countDownVal = result <= 0 ? 5 : result;
    });
  }

  openRandomDataDialog(): void {
    const dialogRef = this.dialog.open(RandomDataDialog, {
      width: '95%',
      height: '95%',
      data: { listRandomData: this.listRandomData }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listRandomData = result;
    });
  }
}

export interface DialogTimeData {
  countDownVal: number;
}

@Component({
  selector: 'time-dialog',
  templateUrl: 'time-dialog.html',
})

export class TimeDialog {
  constructor(
    public dialogRef: MatDialogRef<TimeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogTimeData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'random-data-dialog',
  templateUrl: 'random-data-dialog.html',
})

export class RandomDataDialog {
  displayedColumns: string[] = ['name', 'lucky', 'delete'];
  dataSource = new MatTableDataSource(toSaveList);
  newItemValue;
  listItems;
  multipleTabFucus: boolean = false;

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<RandomDataDialog>,
    @Inject(MAT_DIALOG_DATA) public data: RandomElement[]) { }

  onClickTab(event) {
    if (event.index == 1) {
      this.multipleTabFucus = true;
    } else {
      this.multipleTabFucus = false;
    }
  }

  removeItem(index) {
    toSaveList.splice(index, 1);
    console.log(toSaveList)
    this.dataSource = new MatTableDataSource(toSaveList);
  }

  addItem(val: string) {
    console.log(val);
    if (val != null) {
      toSaveList.push({ name: val, lucky: false, delete: true });
      this.dataSource = new MatTableDataSource(toSaveList);
    }
  }

  addItems(value: string) {
    toSaveList = [];
    let items = value.split('\n');
    for (let i = 0; i < items.length; i++) {
      toSaveList.push({ name: items[i], lucky: false, delete: true });
    }
    this.dataSource = new MatTableDataSource(toSaveList)
  }

  saveData() {
    this.dataService.setDataToRandom(toSaveList);
    this.dialogRef.close();
    location.reload();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}