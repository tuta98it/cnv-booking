import {Component, OnInit, ViewChild} from '@angular/core';
import * as FileSaver from 'file-saver';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';
import {Constant} from '../../../../shared/constants/constant.class';
import {ActivatedRoute} from '@angular/router';
import {FileManagerService} from '../../../../service/file-manager.service';
import {NotificationService} from '../../../../service/notification.service';
import {TableSelectionAbstract} from '../../../../shared/component/table/table-selection.abstract';
import {AppConfigService} from '../../../../../app-config.service';

export interface ChartOptions1 {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
}

export interface ChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
}

export interface ChartOptionsLine {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends TableSelectionAbstract implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild('chart1') chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptionsLine>;
  isDisbled: boolean;
  filterData: any;
  exportLoading: boolean;
  loading: boolean;
  datas: any[];
  gridHeight: any;
  pageIndex: number;
  total: number;
  pageSize: number;
  professions: any[] = [
    {id: 0, name: ''},
    {id: 1, name: 'FC'},
    {id: 2, name: 'CC'},
  ];
  charFilter: any;
  selectedTinhThanhId: any;
  selectedQuanHuyenId: any;
  objNotification: any;

  constructor(
    private route: ActivatedRoute,
    private fileManagerService: FileManagerService,
    private notificationService: NotificationService,
    private configService: AppConfigService
  ) {
    super('id');
    this.pageIndex = 1;
    this.pageSize = 20;
    this.charFilter = {
      from: null,
      to: null,
    };
    this.filterData = {
      page: this.pageIndex,
      pageSize: this.pageSize,
      from: null,
      to: null,
      cmsName: '',
      base: [],
      profession: [],
      function: [],
      type: null,
      status: [],
      sender: '',
      reader: ''
    };

    this.chartOptions = {
      series: [],
      labels: [],
      chart: {
        width: 450,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'gradient'
      },
      legend: {
        // tslint:disable-next-line:only-arrow-functions
        formatter(val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
    // chart1
    // @ts-ignore
    // @ts-ignore
    this.chartOptions1 = {
      series: [
        {
          name: 'Đã kiểm định',
          data: [44, 55, 57, 56, 61, 58, 63]
        },
        {
          name: 'Chưa kiểm định',
          data: [76, 85, 101, 98, 87, 105, 91]
        }
      ],
      chart: {
        type: 'bar',
        height: 450
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          // endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
        ]
      },
      yaxis: {
        title: {
          text: 'Số lượng phương tiện'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          // tslint:disable-next-line:only-arrow-functions
          formatter(val) {
            return val + ' TB';
          }
        }
      }
    };
    this.objNotification = {
      totalCanhBao: 0,
      totalQuaHan: 0
    };
  }

  ngOnInit(): void {
    // this.searchPieChart();
    this.gridHeight = (window.innerHeight - 330) + 'px';
    this.selectedTinhThanhId = +localStorage.getItem(Constant.TINHTHANH);
    this.selectedQuanHuyenId = +localStorage.getItem(Constant.QUANHUYEN);
    // this.searchData(true);
    // this.showNotification();
  }

  showNotification() {
    const payload = {
      tinhThanhId: this.selectedTinhThanhId
    };
    this.fileManagerService.queryCanhBao(payload).subscribe(res => {
      this.objNotification = res;
    }, error => {

    });
  }

  searchData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    let fromDate = null;
    let toDate = null;
    if (this.filterData.from) {
      const newDate = new Date(this.filterData.from);
      fromDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0, 0);
    }
    if (this.filterData.to) {
      const newDate = new Date(this.filterData.to);
      toDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 23, 59, 0, 0);
    }
    const payload = {
      page: this.pageIndex,
      pageSize: this.pageSize,
      from: fromDate,
      to: toDate,
      cmsName: this.filterData.cmsName,
      base: this.filterData.base,
      profession: this.filterData.profession,
      function: this.filterData.function,
      type: !this.filterData.type ? [] : (this.filterData.type >= 0 ? [this.filterData.type] : []),
      status: this.filterData.status,
      sender: this.filterData.sender,
      reader: this.filterData.reader
    };
    console.log(payload);
    this.fileManagerService.reportChungLoaiTheoTinh(this.selectedTinhThanhId).subscribe(res => {
      if (res !== null) {
        this.datas = res.data;
        this.loading = false;
        let stt = 0;
        this.datas.forEach(en => {
          stt++;
          en.stt = stt;
        });
        this.searchPieChart();
        this.searchLineChart();
      }
    }, error => {

    });
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  exportData() {
    let fromDate = null;
    let toDate = null;
    if (this.filterData.from) {
      const newDate = new Date(this.filterData.from);
      fromDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0, 0);
    }
    if (this.filterData.to) {
      const newDate = new Date(this.filterData.to);
      toDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 23, 59, 0, 0);
    }

    this.exportLoading = true;
    const payload = {
      page: this.pageIndex,
      pageSize: this.pageSize,
      from: fromDate,
      to: toDate,
      cmsName: this.filterData.cmsName,
      base: this.filterData.base,
      profession: this.filterData.profession,
      function: this.filterData.function,
      type: !this.filterData.type ? [] : (this.filterData.type >= 0 ? [this.filterData.type] : []),
      status: this.filterData.status,
      sender: this.filterData.sender,
      reader: this.filterData.reader
    };
    this.fileManagerService.fullReportExcel(payload).subscribe(res => {
      this.exportLoading = false;
      if (res !== null) {
        FileSaver.saveAs(res, `Summary_report_${new Date().getMilliseconds()}`);
      }
    }, error => {
      this.exportLoading = false;
    });
  }

  searchLineChart() {
    this.chartOptions1 = {
      series: [
        {
          name: 'Đã kiểm định',
          data: [this.datas[0].totalHD_DKD, this.datas[1].totalHD_DKD, this.datas[2].totalHD_DKD]
        },
        {
          name: 'Chưa kiểm định',
          data: [this.datas[0].totalHD_CKD, this.datas[1].totalHD_CKD, this.datas[2].totalHD_CKD]
        },
        {
          name: 'Hư hỏng',
          data: [this.datas[0].totalHH, this.datas[1].totalHH, this.datas[2].totalHH]
        },
        {
          name: 'Sửa chữa',
          data: [this.datas[0].totalSC_CKD + this.datas[0].totalSC_HKD, this.datas[1].totalSC_CKD + this.datas[1].totalSC_HKD, this.datas[2].totalSC_CKD + this.datas[2].totalSC_HKD]
        },
        {
          name: 'Thanh lý',
          data: [this.datas[0].totalTL, this.datas[1].totalTL, this.datas[2].totalTL]
        }
      ],
      chart: {
        type: 'bar',
        height: 450
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          // endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [
          this.datas[0].name, this.datas[1].name, this.datas[2].name
        ]
      },
      yaxis: {
        title: {
          text: 'Số lượng phương tiện'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          // tslint:disable-next-line:only-arrow-functions
          formatter(val) {
            return val + ' TB';
          }
        }
      }
    };
  }

  searchPieChart() {
    let fromDate = null;
    let toDate = null;
    if (this.charFilter.from) {
      const newDate = new Date(this.charFilter.from);
      fromDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0, 0);
    }
    if (this.charFilter.to) {
      const newDate = new Date(this.charFilter.to);
      toDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 23, 59, 0, 0);
    }

    const seriesS = [this.datas[0].total, this.datas[1].total, this.datas[2].total];
    // seriesS.splice(3, 1);
    const labelS = [this.datas[0].name, this.datas[1].name, this.datas[2].name];
    // labelS.splice(3, 1);
    // console.log(seriesS);
    this.chartOptions = {
      series: seriesS,
      labels: labelS,
      chart: {
        type: 'donut'
      },
      dataLabels: {
        enabled: true
      },
      fill: {
        type: 'gradient'
      },
      legend: {
        // tslint:disable-next-line:only-arrow-functions
        formatter(val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }

  exportTkData() {
    const mainUrl = this.configService.getConfig().api.reportUrl + '/BridgeXLSDownload.aspx';
    const url = mainUrl + `?ProvinceId=${this.selectedTinhThanhId}&report=ReportThietBi`;
    window.open(url, '_blank');
  }

  afterClose() {

  }

  showDetail(type: number) {
    location.href = '/thiet-bi/' + type;
  }
}
