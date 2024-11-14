import {Component, OnInit} from '@angular/core';
import {Constant} from '../../../../../shared/constants/constant.class';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill, ApexLegend, ApexNonAxisChartSeries,
  ApexPlotOptions, ApexResponsive,
  ApexStroke, ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';
import {ActivatedRoute} from '@angular/router';
import {FileManagerService} from '../../../../../service/file-manager.service';
import {NotificationService} from '../../../../../service/notification.service';
import {AppConfigService} from '../../../../../../app-config.service';
import {NzIconService} from 'ng-zorro-antd/icon';
import {GeneralService} from '../../../../../service/general-service';
import {DateFormatPipe} from '../../../../../shared/pipe/format-date.pipe';

@Component({
  selector: 'app-rating-report',
  templateUrl: './rating-report.component.html',
  styleUrls: ['./rating-report.component.scss']
})
export class RatingReportComponent implements OnInit {
  userInfo: any;
  TIME_RANGE_FILTER = Constant.TIME_RANGE_FILTER;
  search = {
    type: 3,
    fromDate: null,
    toDate: null,
  };

  public pieChartOptions: any[];
  pieChartTicketOptions: any[];
  pieChartHotelOptions: any[];
  pieChartVHLOptions: any[];

  tableTicket: any;
  tableHotel: any;
  tableVHL: any;

  resArr: any[] = [];
  selectedIndex: 0;
  chartTitles = [
    'Đánh giá về quá trình đặt vé',
    'Đánh giá về chất lượng dịch vụ hỗ trợ',
    'Nhận xét về giá cả dịch vụ',
    'Danh sách góp ý từ người dùng về dịch vụ đặt vé',

    'Đánh giá về quy trình đặt phòng KS',
    'Đánh giá về sự tiện lợi, phù hợp',
    'Đánh giá về điều kiện vệ sinh',
    'Đánh giá về chất lượng khách sạn',
    'Đánh giá về thái độ phục vụ',
    'Nhận xét về mức giá',
    'Danh sách góp ý từ người dùng về dịch vụ đặt lưu trú',

    'Gặp sự cố khi sử dụng hệ thống',
    'Đánh giá về giao diện & trải nghiệm',
    'Đánh giá về tốc độ xử lý',
    'Gặp sự cố khi sử dụng hệ thống',
    '',
    'Đánh giá dịch vụ VHL (chỉ số NPS)',
    'Khả năng giới thiệu dịch vụ VHL',
    'Danh sách góp ý từ người dùng về dịch vụ của VHL',
  ];


  constructor(
    private route: ActivatedRoute,
    private fileManagerService: FileManagerService,
    private notificationService: NotificationService,
    private configService: AppConfigService,
    private iconService: NzIconService,
    private generalService: GeneralService,
    private dateFormatPipe: DateFormatPipe,
  ) {
    this.pieChartOptions = [];
    this.pieChartTicketOptions = [];
    this.pieChartHotelOptions = [];
    this.pieChartVHLOptions = [];
  }

  ngOnInit(): void {
    this.generalService.adminReportRating({type: this.search.type}).subscribe((resArr) => {
      this.resArr = resArr;
      this.bindChart(0);
    });
  }

  bindChart(type) {
    this.pieChartOptions = [];
    this.pieChartTicketOptions = [];
    this.pieChartHotelOptions = [];
    this.pieChartVHLOptions = [];
    this.tableTicket = this.resArr.find(en => en.ratingType === 4);
    this.tableHotel = this.resArr.find(en => en.ratingType === 11);
    this.tableVHL = this.resArr.find(en => en.ratingType === 19);
    this.resArr.forEach(res => {
      this.pieChartOptions.push({
        type: res.type,
        ratingType: res.ratingType,
        series: this.toSeries(res.ratingType, res),
        title: {
          text: res.ratingTypeName,
          align: 'center',
        },
        chart: {
          type: 'donut'
        },
        labels: this.toLabels(res.ratingType),
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
      });
      if (type === 0) {
        this.pieChartTicketOptions = this.pieChartOptions.filter(en => en.type === 1 && en.ratingType !== 4);
      } else if (type === 1) {
        this.pieChartHotelOptions = this.pieChartOptions.filter(en => en.type === 2 && en.ratingType !== 11);
      } else if (type === 2) {
        this.pieChartVHLOptions = this.pieChartOptions.filter(en => en.type === 3 && en.ratingType !== 19 && en.ratingType !== 16);
      }
    });
  }


  doSearch() {
    this.generalService.adminReportRating({type: this.search.type}).subscribe((resArr) => {
      this.resArr = resArr;
      this.bindChart(this.selectedIndex);
    });
  }

  tabChange($event) {
    console.log('event change');
    this.bindChart($event.index);
  }

  toLabels(ratingType) {
    if (ratingType === 12 || ratingType === 15) {
      return ['Có', 'Không'];
    } else if (ratingType === 17 || ratingType === 18) {
      return ['0-3 điểm', '4-6 điểm', 'Bình thường', '7-8 điểm', '9-10 điểm'];
    } else {
      return ['Rất không hài lòng', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];
    }
  }

  toSeries(ratingType, res) {
    if (ratingType === 12 || ratingType === 15) {
      return [res.value1, res.value2];
    } else if (ratingType === 17 || ratingType === 18) {
      return [res.value1, res.value2, res.value3, res.value4];
    } else {
      return [res.value1, res.value2, res.value3, res.value4, res.value5];
    }
  }

}
