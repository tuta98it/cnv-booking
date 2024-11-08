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
  public pieChartUserOptions: Partial<PieChartOptions>;

  @ViewChild('pieChartProfit') pieChartProfit: ChartComponent;
  public pieChartProfitOptions: Partial<PieChartOptions>;

  public pieChartServiceOptions: Partial<PieChartOptions>;
  public pieChartRatingOptions: Partial<PieChartOptions>;
  public pieChartBookingUrgentOptions: Partial<PieChartOptions>;

  public chartRevenueOptions: Partial<ChartOptions>;

  userInfo: any;
  TIME_RANGE_FILTER = Constant.TIME_RANGE_FILTER;
  search = {
    type: 1,
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

  private getDataSalesReport() {
    const payloadSalesReport = {...this.search};

    // Tài khoản người dùng
    this.generalService.reportAverageTime(payloadSalesReport).subscribe((res) => {
      this.avgItem = res;
    });

    this.generalService.reportUser(payloadSalesReport).subscribe((res) => {
      this.pieChartUserOptions = {
        series: [res.newUserActive, res.newUserDeActive, res.oldUserActive,  res.oldUserDeActive],
        title: {
          text: 'Tài khoản người dùng',
          align: 'center',
        },
        chart: {
          type: 'donut'
        },
        labels: ['Người dùng mới active', 'Người dùng mới deactive', 'Người dùng cũ active', 'Người dùng cũ deactive'],
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
        series: [res.rateFiveStar, res.rateFourStar, res.rateThreeStar, res.rateTwoStar, res.totalRate + res.rateOneStar],
        chart: {
          type: 'donut'
        },
        labels: ['Khách hàng rất hài lòng', 'Khách hàng đánh giá tốt', 'Trải nghiệm ở mức trung bình', 'Trải nghiệm tệ/rất tệ'],
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
        }
      };
    });
    /*this.generalService.salesReport(payloadSalesReport).subscribe((res) => {
      if (res) {
        this.objRevenue.totalSales = res.tongDoanhSo;

        let dataSales = [];
        const top10Seller = res.data.slice(0, 10);
        for (let i = 0; i < top10Seller.length; i++) {
          const seller = res.data[i];
          dataSales.push({x: [seller.code, seller.name], y: seller.doanhSo});
        }
        let sales = {
          name: 'Tổng doanh thu',
          data: dataSales,
        };

        let series = [];
        series.push(sales);

        this.barChartSaleOptions = {
          series: series,
          chart: {
            type: 'bar',
            height: 350,
          },
          title: {
            text: 'Top Sale có doanh thu cao nhất',
            align: 'left',
          },
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          yaxis: {
            labels: {
              formatter(value) {
                const item = value
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
                return item;
              },
            },
          },
          xaxis: {
            labels: {
              rotate: 0,
              hideOverlappingLabels: false,
              trim: true,
            },
          },
        };

      }
    });*/
  }

  doSearch() {
    this.getDataSalesReport();
    this.loadReport();
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
}
