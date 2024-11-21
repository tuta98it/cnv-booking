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
  ApexTitleSubtitle,
  ApexMarkers,
  ApexGrid
} from 'ng-apexcharts';
import {Constant} from 'src/app/shared/constants/constant.class';
import {ActivatedRoute} from '@angular/router';
import {FileManagerService} from '../../../../service/file-manager.service';
import {NotificationService} from '../../../../service/notification.service';
import {TableSelectionAbstract} from '../../../../shared/component/table/table-selection.abstract';
import {AppConfigService} from '../../../../../app-config.service';
import {NzIconService} from 'ng-zorro-antd/icon';
import {GeneralService} from 'src/app/service/general-service';
import {DateFormatPipe} from 'src/app/shared/pipe/format-date.pipe';

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
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
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

export interface PieChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
}


export interface BarChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  title: ApexTitleSubtitle;
}

export interface LineChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  fill: ApexFill;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends TableSelectionAbstract implements OnInit {
  @ViewChild('pieChartUser') pieChartUser: ChartComponent;
  public pieChartUserOptions: any;

  @ViewChild('pieChartProfit') pieChartProfit: ChartComponent;
  public pieChartProfitOptions: any;

  public pieChartServiceOptions: any;
  public pieChartRatingOptions: any;
  public pieChartBookingUrgentOptions: any;

  public chartRevenueOptions: any;

  userInfo: any;
  TIME_RANGE_FILTER = Constant.TIME_RANGE_FILTER;
  search = {
    type: 0,
    fromDate: null,
    toDate: null,
  };

  objRevenue: any = {
    totalSales: 0,
  };
  avgItem: any;

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
  sourceTopBooking: any[] = [];
  sourceTopAirline: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private fileManagerService: FileManagerService,
    private notificationService: NotificationService,
    private configService: AppConfigService,
    private iconService: NzIconService,
    private generalService: GeneralService,
    private dateFormatPipe: DateFormatPipe,
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
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.doSearch();

    // this.searchPieChart();
    this.gridHeight = (window.innerHeight - 330) + 'px';
    this.selectedTinhThanhId = +localStorage.getItem(Constant.TINHTHANH);
    this.selectedQuanHuyenId = +localStorage.getItem(Constant.QUANHUYEN);
    // this.searchData(true);
    // this.showNotification();
  }

  loadGrid() {
    const payload = {...this.search, topRecord: 20};
    this.generalService.reportTopHotel(payload).subscribe(res => {
      this.sourceTopBooking = res.data;
      let index = 1;
      this.sourceTopBooking.forEach(en => {
        en.index = index++;
      });
    }, error => {

    });

    this.generalService.reportTopAirline(payload).subscribe(res => {
      this.sourceTopAirline = res.data;
      let index = 1;
      this.sourceTopAirline.forEach(en => {
        en.index = index++;
      });
    }, error => {

    });
  }

  private getDataSalesReport() {
    const payloadSalesReport = {...this.search};

    // Tài khoản người dùng
    this.generalService.reportAverageTime(payloadSalesReport).subscribe((res) => {
      this.avgItem = res;
    });

    this.generalService.reportUser(payloadSalesReport).subscribe((res) => {
      this.pieChartUserOptions = {
        series: [res.newUserActive, res.newUserDeActive, res.oldUserActive, res.oldUserDeActive],
        title: {
          text: 'Tài khoản người dùng',
          align: 'center',
        },
        chart: {
          type: 'donut'
        },
        labels: ['Người dùng mới active', 'Người dùng mới deactive', 'Người dùng cũ active', 'Người dùng cũ deactive'],
        plotOptions: this.toPlotOption(res.totalUser),
        dataLabels: {
          enabled: true
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'top',
              },
            },
          },
        ]
      };
    });

    // Phân bổ lợi nhuận
    this.generalService.reportProfit(payloadSalesReport).subscribe((res) => {
      this.pieChartProfitOptions = {
        series: [res.expense, res.profit],
        title: {
          text: 'Tài khoản người dùng',
          align: 'center',
        },
        chart: {
          type: 'donut'
        },
        labels: ['Chi phí lưu trú', 'Lợi luận gộp'],
        plotOptions: this.toPlotOption(res.totalRevenue),
        dataLabels: {
          enabled: true
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'top',
              },
            },
          },
        ]
      };
    });

    // Yêu cầu dịch vụ
    this.generalService.reportService(payloadSalesReport).subscribe((res) => {
      this.pieChartServiceOptions = {
        series: [res.totalAirlinetTickets, res.totalHotelRequests],
        chart: {
          type: 'donut'
        },
        labels: ['Dịch vụ vé máy bay', 'Dịch vụ lưu trú'],
        plotOptions: this.toPlotOption(res.totalServices),
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'top',
              },
            },
          },
        ]
      };
    });

    // Chỉ số NPS
    this.generalService.reportRating(payloadSalesReport).subscribe((res) => {
      this.pieChartRatingOptions = {
        series: [res.rateFiveStar, res.rateFourStar, res.rateThreeStar, res.rateTwoStar + res.rateOneStar],
        chart: {
          type: 'donut'
        },
        labels: ['Khách hàng rất hài lòng', 'Khách hàng đánh giá tốt', 'Trải nghiệm ở mức trung bình', 'Trải nghiệm tệ/rất tệ'],
        plotOptions: this.toPlotOption(res.totalRate),
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'top',
              },
            },
          },
        ]
      };
    });

    // Chỉ số đặt gấp
    this.generalService.reportBookingUrgent(payloadSalesReport).subscribe((res) => {
      this.pieChartBookingUrgentOptions = {
        series: [res.totalAirlinetTickets, res.totalHotelRequests],
        chart: {
          type: 'donut'
        },
        labels: ['Dịch vụ vé máy bay', 'Dịch vụ lưu trú'],
        plotOptions: this.toPlotOption(res.totalServices),
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'top',
              },
            },
          },
        ]
      };
    });

    // Trạng thái các yêu cầu
    this.generalService.reportStatusService(payloadSalesReport).subscribe((res) => {
      this.chartOptions = {
        series: [{
          name: 'Dịch vụ vé máy bay thành công',
          data: res.data.map(en => en.totalAirlinetTicketSuccess)
        },
          {
            name: 'Dịch vụ vé máy bay thất bại',
            data: res.data.map(en => en.totalAirlinetTicketError)
          },
          {
            name: 'Dịch vụ lưu trú thành công',
            data: res.data.map(en => en.totalHotelRequestsSuccess)
          },
          {
            name: 'Dịch vụ lưu trú thất bại',
            data: res.data.map(en => en.totalHotelRequestsError)
          }
        ],
        chart: {
          type: 'bar',
          height: 430
        },
        plotOptions: {
          bar: {
            horizontal: false,
          }
        },
        dataLabels: {
          enabled: false,
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#fff']
          }
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          categories: res.data.map(en => en.dateStr)
        }
      };
    });

    // Doanh thu theo doanh nghiệp
    this.generalService.reportRevenueByPartner(payloadSalesReport).subscribe((res) => {
      this.chartRevenueOptions = {
        series: [{
          name: 'Doanh thu kỳ này',
          data: res.data.map(en => en.revenue)
        },
          {
            name: 'Doanh thu kỳ trước',
            data: res.data.map(en => en.previousRevenue)
          }
        ],
        chart: {
          type: 'bar',
          height: 430
        },
        plotOptions: {
          bar: {
            horizontal: false,
          }
        },
        dataLabels: {
          enabled: false,
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#fff']
          }
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          categories: res.data.map(en => en.partnerName)
        },
        tooltip: {
          y: {
            formatter: (value: number) => {
              // Format số tiền thành tiền tệ Việt Nam Đồng (VND)
              return value.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
              });
            }
          }
        }
      };
    });
  }

  doSearch() {
    this.getDataSalesReport();
    this.loadReport();
    this.loadGrid();
  }

  loadReport() {
    const payload = {type: this.search.type};
    this.generalService.reportAverageTime(payload).subscribe(res => {
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

  toPlotOption(total: number) {
    return {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '30px',
              color: '#000',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '16px',
              color: '#000',
              offsetY: 10,
              formatter: (val: number) => `${val}%`
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Tổng',
              fontSize: '18px',
              color: '#000',
              formatter: (w: any) => {
                // Tính tổng giá trị trong `series`
                return total;
              }
            }
          }
        }
      }
    };
  }
}
