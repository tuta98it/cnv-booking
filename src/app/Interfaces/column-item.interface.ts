import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface ColumnItem {
  name: string;
  width: string;
  align: 'left' | 'right' | 'center';
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn | null;
  showFilter: boolean | false;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn | null;
  filterMultiple: boolean | false;
  sortDirections: NzTableSortOrder[];
}
