import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { MENU_CREATE_PARTNER_OPTION, MenuCreatePartner } from 'src/app/enums/menu-create-partner.enum';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import { NZTableSettingCustoms } from 'src/app/Interfaces/nz-table-seting.interface';
import { ActionTypePageVHL } from 'src/app/enums/action-type-page-vhl.enum';


interface ItemData {
  name: string;
  age: number | string;
  address: string;
  checked: boolean;
  expand: boolean;
  description: string;
  disabled?: boolean;
}

type TableScroll = 'unset' | 'scroll' | 'fixed';

interface NZTableSetting {
  bordered: boolean;
  loading: boolean;
  pagination: boolean;
  sizeChanger: boolean;
  title: boolean;
  header: boolean;
  footer: boolean;
  expandable: boolean;
  checkbox: boolean;
  fixHeader: boolean;
  noResult: boolean;
  ellipsis: boolean;
  simple: boolean;
  size: NzTableSize;
  tableScroll: TableScroll;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
}
@Component({
  selector: 'app-action-partner',
  templateUrl: './action-partner.component.html',
  styleUrls: ['./action-partner.component.scss']
})
export class ActionPartnerComponent implements OnInit {


  MenuCreatePartner = MenuCreatePartner;
  MENU_CREATE_PARTNER_OPTION = MENU_CREATE_PARTNER_OPTION;
  selectedMenu = MenuCreatePartner.ListEmployees;
  actionPartnerVHL: any;
  settingTableListEmployeesForm: FormGroup;
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingTableEmployeesValue: NZTableSettingCustoms;
  listOfEmployees: readonly ItemData[] = [];
  displayData: readonly ItemData[] = [];
  formActionPartner: FormGroup;
  constructor(
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.formActionPartner = this.formBuilder.group({
      id: [null],
      status: [],
      name: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
      taxCode: [null, [Validators.required]],
      phone: [null],
      email: [null, [Validators.required]],
      address: [null, [Validators.required]],
      debtMax: [null],
      debtUsed: [null],
      debtRemain: [null],
      note: [null],
    });

    this.settingTableListEmployeesForm = this.formBuilder.group({
      bordered: [false],
      loading: [false],
      pagination: [true],
      sizeChanger: [false],
      title: [false],
      header: [true],
      footer: [false],
      expandable: [true],
      checkbox: [true],
      fixHeader: [false],
      noResult: [false],
      noResultText: 'Danh sách nhân viên đang trống. Hãy nhấn vào “Thêm mới” để tạo mới các tài khoản nhân viên cho doanh nghiệp',
      ellipsis: [false],
      simple: [false],
      size: 'small' as NzTableSize,
      paginationType: 'default' as NzTablePaginationType,
      tableScroll: 'unset' as TableScroll,
      tableLayout: 'auto' as NzTableLayout,
      position: 'bottom' as NzTablePaginationPosition
    });

    this.settingTableEmployeesValue = this.settingTableListEmployeesForm.value as NZTableSettingCustoms;
  }

  ngOnInit(): void {
    // Lấy giá trị status từ route data
    this.actionPartnerVHL = this.activatedRoute.snapshot.data['type'];
    if(this.actionPartnerVHL == ActionTypePageVHL.Create){
      this.listOfEmployees = [];
    }

    this.settingTableListEmployeesForm.valueChanges.subscribe(value => {
      this.settingTableEmployeesValue = value as NZTableSettingCustoms;
    });
    this.settingTableListEmployeesForm.controls.tableScroll.valueChanges.subscribe(scroll => {
      this.fixedColumn = scroll === 'fixed';
      this.scrollX = scroll === 'scroll' || scroll === 'fixed' ? '100vw' : null;
    });
    this.settingTableListEmployeesForm.controls.fixHeader.valueChanges.subscribe(fixed => {
      this.scrollY = fixed ? '240px' : null;
    });
    this.settingTableListEmployeesForm.controls.noResult.valueChanges.subscribe(empty => {
      if (empty) {
        this.listOfEmployees = [];
      } else {
        this.listOfEmployees = this.generateData();
      }
    });

  }


  generateData(): readonly ItemData[] {
    const data = [];
    for (let i = 1; i <= 100; i++) {
      data.push({
        name: 'John Brown',
        age: `${i}2`,
        address: `New York No. ${i} Lake Park`,
        description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
        checked: false,
        expand: false
      });
    }
    return data;
  }


  currentPageDataChange($event: readonly ItemData[]): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const validData = this.displayData.filter(value => !value.disabled);
    const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
    const allUnChecked = validData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }


  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }


}
