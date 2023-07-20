import { TableSelectionInterface } from './table-selection.interface';
import {HostListener} from '@angular/core';

export abstract class TableSelectionAbstract implements TableSelectionInterface {

  isAllDisplayDataChecked = false;
  isOperating = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  prop: string;

  mapOfCheckedId: { [key: number]: boolean } = {};
  numberOfChecked = 0;
  dxGridHeight: any;
  currentFilter: any;
  constructor(
    prop: string
  ) {
    this.prop = prop;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.initTableHeight();
  }
  initTableHeight(gridWidth = 1200) {
    setTimeout(() => {
      const filterTop = document.getElementsByClassName('action-button')[0];
      let filterHeight = filterTop ? filterTop.clientHeight : 0;

      const filterBottom = document.getElementsByClassName('filter')[0];
      filterHeight += filterBottom ? filterBottom.clientHeight : 0;

      // console.log(filterHeight, window.innerHeight);
      let gridHeight = window.innerHeight - 80 - 55 - 50 - filterHeight; // 34: pagging height
      const gridFooter = document.getElementsByClassName('grid-footer')[0];
      if (gridFooter) {
        gridHeight = gridHeight - gridFooter.clientHeight;
      }
      this.dxGridHeight = `${gridHeight + 45}px`;
    }, 10);
  }
  setListOfAllData(listOfAllData: any[]) {
    this.listOfAllData = listOfAllData.map(item => {
      return Object.assign({}, item);
    });
  }
  currentPageDataChange($event: any[]): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(value?: boolean, obj?: any, childrenName?: string): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every( item => this.mapOfCheckedId[item[this.prop]]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item[this.prop]]) &&
      !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.listOfAllData.filter(item => this.mapOfCheckedId[item[this.prop]]).length;
    if (value !== undefined && obj !== undefined && childrenName !== undefined) {
      this.setChildrenStatus(value, obj, childrenName);
    }

  }

  setChildrenStatus(value: boolean, obj: any, childrenName: string) {
    if (obj[childrenName] !== null && obj[childrenName].length > 0) {
      for (const child of obj[childrenName]) {
        this.mapOfCheckedId[child[this.prop]] = value;
        this.setChildrenStatus(value, child, childrenName);
      }
    }
    return;
  }

  checkAllRow(value: boolean, childrenName?: string): void {
    this.listOfDisplayData.forEach(item =>
      {
        this.mapOfCheckedId[item[this.prop]] = value;
        if (childrenName !== undefined) {
          this.setChildrenStatus(value, item, childrenName);
        }
      }
    );
    this.refreshStatus();
  }

  checkAll(value: boolean): void {
    this.listOfAllData.filter(item => item.status != 2 && item.status != 3).forEach(item => (this.mapOfCheckedId[item[this.prop]] = value));
    this.refreshStatus();
  }

  getCheckedIdList(searchText?: string, searchData?: any[]): number[] {
    const listIds = [];
    let isChecked = false;

    Object.keys(this.mapOfCheckedId).forEach(key => {
      if (this.mapOfCheckedId[key]) {
        listIds.push(Number(key));
        isChecked = true;
      }
    });

    if (searchData !== undefined
      && searchText !== undefined
      && (searchText.trim()).length > 0
      && !isChecked
    ) {
      searchData.forEach(item => {
        listIds.push(item[this.prop]);
      });
    }
    return listIds;
  }

}
