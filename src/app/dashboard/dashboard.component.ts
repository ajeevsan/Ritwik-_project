import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { NotificationService } from 'src/services/notification.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Litepicker from 'litepicker';
import { AuthService } from 'src/services/auth.service';
import { DataStorageService } from '../../services/data-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  searchQuery = "";
  startDate;
  endDate;
  startTime;
  endTime;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings;
  picker;

  constructor(private storage: DataStorageService, private router: Router, private notifyService: NotificationService, private backendService: BackendService, private authService: AuthService) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 6,
      allowSearchFilter: true
    };
  }

  ngOnInit()
  {
    let tempStartTime = document.getElementById("start-time") as HTMLInputElement;
    let tempEndTime = document.getElementById("end-time") as HTMLInputElement;
    tempStartTime.value = "00:00";
    tempEndTime.value = "23:59";
    this.startTime = tempStartTime.value;
    this.endTime = tempEndTime.value;

    this.picker = new Litepicker({ 
      element: document.getElementById('start-date'),
      elementEnd: document.getElementById('end-date'),
      singleMode: false,
      allowRepick: true,
      dropdowns: {"minYear":2016,"maxYear":2022,"months":true,"years":true}
    });
  }

  onItemSelect(item: any) 
  {
    console.log(item);
  }

  onSelectAll(items: any) 
  {
    console.log(items);
  }
  
  search()
  {
    let option = document.getElementById("searchParam") as HTMLSelectElement;
    let optionVal = option.value;
    if(this.searchQuery == "")
    {
      this.notifyService.showInfo("Search Field Cannot be Empty!", "Notification");
      return;
    }
    this.router.navigate(["/query", "d" + optionVal + ',' + this.searchQuery]);
  }

  searchDateTime()
  {
    let tempStartDate = document.getElementById("start-date") as HTMLInputElement;
    let tempEndDate = document.getElementById("end-date") as HTMLInputElement;
    let tempStartTime = document.getElementById("start-time") as HTMLInputElement;
    let tempEndTime = document.getElementById("end-time") as HTMLInputElement;
    this.startDate = tempStartDate.value;
    this.endDate = tempEndDate.value;
    this.startTime = tempStartTime.value;
    this.endTime = tempEndTime.value;

    console.log("Start Date", this.startDate);
    console.log("End Date", )
    
    if(this.startDate == "" && this.endDate == "")
    {
      this.notifyService.showInfo("Select Date First!", "Notification");
      return;
    }

    let query = [this.startDate, this.endDate, this.startTime, this.endTime];
    this.backendService.searchDateTime(query).subscribe((data: Array<any>) => {
      console.log('received data',data)
      this.storage.dataFromDB = [...data];
      this.router.navigate(['/searchDateTime']);
    });
  }

  logout()
  {
    this.notifyService.showInfo("Logged Out!", "Notification");
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Function for introducing delay in ms
  delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }
}
