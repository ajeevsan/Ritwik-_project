import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { NotificationService } from 'src/services/notification.service';
import { DataTableDirective } from 'angular-datatables';
import { DataStorageService } from 'src/services/data-storage.service';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import * as XLSX from 'xlsx';
import { state } from '@angular/animations';
// import * as fs from 'fs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-search-date-time',
  templateUrl: './search-date-time.component.html',
  styleUrls: ['./search-date-time.component.css']
})

export class SearchDateTimeComponent implements OnInit {
  loading = true;
  error = false;
  dtOptions: any = {};
  min: number;
  max: number;
  dataFromDB: Array<any>;
  modal: boolean = false;
  tableData
  dataForExcel

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: any = DataTableDirective;
  
  constructor(private storage: DataStorageService, private router: Router, private notifyService: NotificationService, private authService: AuthService) { 
    this.initialData();
  }

  initialData()
  {
    this.tableData = [...this.storage.dataFromDB];
    if(this.tableData.length > 15000){
      this.dataFromDB = this.storage.dataFromDB.slice(0, 15000);
      // this.dataForPDF = this.storage.dataFromDB.slice(0, 15000);
      this.notifyService.showInfo('Download Excel for Full data','Notification');
      this.notifyService.showInfo('Data limit exceeds, Only 15,000 data is displaying','Notification');
    }
    else{
      this.dataFromDB = [...this.storage.dataFromDB];
      // this.dataForPDF = [...this.storage.dataFromDB];
    }
    if(this.tableData.length > 250000){
      this.dataForExcel = this.storage.dataFromDB.slice(0, 250000);
    }
    else{
      this.dataForExcel = this.tableData;
    }
    
    // console.log('dataFromDB length',this.dataFromDB.length);
    if(this.dataFromDB.length === 0)
      this.error = true;
    this.loading = false;
  }

  reload() 
  {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    $.fn['dataTable'].ext.search.pop();
    this.router.navigate(['/searchDateTime']);
  }

  // Function for introducing delay in ms
  delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }

  ngOnInit()
  {
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip', 
      buttons: [{extend: 'pdfHtml5', orientation: 'landscape', pageSize: 'A1', filename: 'DB_PDF'}]    
    };
  }

  // pdfMaker(){
  //   pdfMake.fonts = {
  //     Roboto: {
  //         normal: 'Roboto-Regular.ttf',
  //         bold: 'Roboto-Medium.ttf',
  //         italics: 'Roboto-Italic.ttf',
  //         bolditalics: 'Roboto-MediumItalic.ttf'
  //     }
  //   };
  //   const table =<HTMLTableElement> document.getElementById('table');
  //   let data = [];
  //   let headers = [];
  //   for (let i = 0; i < table.rows[0].cells.length; i++) {
  //     headers.push(table.rows[0].cells[i].innerHTML);
  //   }
  //   data.push(headers);
  //   const dataCopy = JSON.parse(JSON.stringify(this.dataForPDF));
  //   for(let i=0;i < dataCopy.length; i++){
  //     data.push(dataCopy[i]);
  //   }
  //   // data.push(dataCopy)
  //   const docDefinition = {
  //     pageSize: 'A1',
  //     pageOrientation: 'landscape',
  //     content: [
  //       {
  //         table: {
  //           headerRows: 1,
  //           body: data,
  //         }
  //       }
  //     ]
  //   };
  //   console.log('processing');
  //   pdfMake.createPdf(docDefinition).download();
    
  // console.log('ended')
  // }
  

  excelmaker(){
    if(this.tableData.length > 250000)
    {
      this.notifyService.showInfo('Data limit exceeds, Only 250,000 data is Downloading','Notification');
    }
    // const dataCopy = JSON.parse(JSON.stringify(this.tableData));
    let table = document.getElementById('table');
    let headerRow = table.getElementsByTagName('thead')[0].rows[0];
    let header = [];

    for (let i = 0; i < headerRow.cells.length; i++) {
        header.push(headerRow.cells[i].innerHTML);
    }
    let filename = 'Database.xlsx';
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([header,...this.dataForExcel]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');
    XLSX.writeFile(workbook, filename);
    console.log('excel ended')
  }

  filterById()
  {
    let dropdown = document.getElementById('column') as HTMLSelectElement;
    $.fn.dataTable.ext.search.push((settings: any, data: string[], dataIndex: any) => {
      const id = parseFloat(data[parseInt(dropdown.value)]) || 0;
      return (Number.isNaN(this.min) && Number.isNaN(this.max)) ||
          (Number.isNaN(this.min) && id <= this.max) ||
          (this.min <= id && Number.isNaN(this.max)) ||
          (this.min <= id && id <= this.max);
    });
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
    
    this.modal = false;
  }

  clickRow(rowID)
  {
    this.router.navigate(["/query", "s" + rowID]);
  }

  modalViewToggle()
  {
    this.modal = !this.modal;
  }

  back()
  {
    this.router.navigate(["/dashboard"]);
  }

  logout()
  {
    this.storage.dataFromDB.length = 0;
    this.notifyService.showInfo("Logged Out!", "Notification");
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    $.fn['dataTable'].ext.search.pop();
  }
}
