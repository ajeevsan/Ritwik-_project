    import { Component, OnInit, Input  } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BackendService } from 'src/services/backend.service';
import { NotificationService } from 'src/services/notification.service';
import { AuthService } from 'src/services/auth.service';
import { Chart, registerables } from 'chart.js';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {

  dataFromDB;
  loading = true;
  error = false;
  ID: String;
  identifier: String;
  chart;
  imgFromBackend;
  table: any;
  img_flag: boolean = false
  change
  max_graph_value
  min_graph_value
  showBIgImg: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private backendService: BackendService, private notifyService: NotificationService, private authService: AuthService) {
    Chart.register(...registerables);
  }

  // Function for introducing delay in ms
  delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }

  async ngOnInit()
  {
    this.route.params.subscribe((params: Params) => this.ID = params['ID']);
    this.identifier = this.ID.substring(0, 1);
    this.ID = this.ID.substring(1);

    this.backendService.search(this.ID).subscribe((data) => {
      this.dataFromDB = data;
      if(this.dataFromDB.length === 0)
      {
        this.error = true;
      }
      this.loading = false;
    });

    if(this.error == false)
    {
      await this.delay(100);
      this.drawGraph();

      this.backendService.getImg(this.dataFromDB[0][23]).subscribe(data =>{
        this.img_flag = data['img_there']
        if(this.img_flag)
          this.imgFromBackend = 'data:image/jpg;base64,' + data['encoded_image'];
      });
    }
  }

  back()
  {
    console.log('start')
    console.log('this.identifier', this.identifier)
    this.dataFromDB.length = 0;
    if(this.identifier == "s")
      this.router.navigate(["/searchDateTime"]);
    else
      this.router.navigate(["/dashboard"]);
    console.log('end')
  }

  logout()
  {
    this.notifyService.showInfo("Logged Out!", "Notification");
    this.authService.logout();
    this.router.navigate(['/login']);
  }



  drawGraph()
  {
    this.max_graph_value = Math.max(this.dataFromDB[0][7], this.dataFromDB[0][10], this.dataFromDB[0][11], this.dataFromDB[0][12], this.dataFromDB[0][8]);
    this.min_graph_value = Math.min(this.dataFromDB[0][7], this.dataFromDB[0][10], this.dataFromDB[0][11], this.dataFromDB[0][12], this.dataFromDB[0][8]);

    this.chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: ["Slab Start Width", "Average Head Width", "Average Body Width", "Average Tail Width", "Slab End Width"],
        datasets: [{
          borderColor: "#bae755",
          borderDash: [5, 5],
          backgroundColor: "#e755ba",
          pointBackgroundColor: "#368eb4",
          pointBorderColor: "#368eb4",
          pointHoverBackgroundColor: "#368eb4",
          pointHoverBorderColor: "#368eb4",
          data: [this.dataFromDB[0][7], this.dataFromDB[0][10], this.dataFromDB[0][11], this.dataFromDB[0][12], this.dataFromDB[0][8]]
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: this.min_graph_value - 25,
            max: this.max_graph_value + 25,
            title: {
              display: true,
              text: '',
              padding: {
                bottom: 10
              },
              font: {
                size: 18,
                family: 'SF Pro Display'
              }
            }
          },
          x: {
            title: {
              display: true,
              text: '',
              align: 'center',
              padding: {
                top: 10
              },
              font: {
                size: 18,
                family: 'SF Pro Display'
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: '',
            padding: {
              bottom: 10
            },
            font: {
              size: 18,
              family: 'SF Pro Display'
            }
          },
        },
      }
    });
  }

  savePDF()
  {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.text('RESULTS', 90, 10);
    doc.addImage('../../assets/icons/JSW-Steel-Logo.png', 'PNG', 180, 2, 20, 10);
    doc.addImage('../../assets/icons/logo.png', 'PNG', 10, 2, 30, 10);
    autoTable(doc, { html: '#table'});
    autoTable(doc, { html: '#table2'});
    let imgData = this.imgFromBackend;
    if(imgData)
      doc.addImage(imgData, 'PNG', 20, 222, 170, 30);
    else
      doc.addImage('../../assets/icons/no-data.png', 'PNG', 75, 225, 70, 20);
    const chartImg = this.chart.toBase64Image();
    doc.addImage(chartImg, 'PNG', 40, 250, 120, 45);
    doc.setFontSize(10);
    doc.text('Deevia Software India PVT. LTD. © 2013', 75, doc.internal.pageSize.height - 3);
    doc.save(this.ID + '.pdf');
  }

  saveExcel() {
      this.table = document.getElementById('table');
      let tableData = [];
      let rows = this.table.getElementsByTagName("tr");
  
      for (let i = 0; i < rows.length; i++) {
          const cells = rows[i].getElementsByTagName("td");
          const rowData = [];
          for (let j = 0; j < cells.length; j++) {
              rowData.push(cells[j].innerHTML);
          }
          tableData.push(rowData);
      }

      let filename = this.ID + '.xlsx';
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(tableData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');
      XLSX.writeFile(workbook, filename);
  }

  
  enlarge()
  {
    this.showBIgImg = true;
  }

  toggleBigImg()
  {
    this.showBIgImg = false;
  }
}
