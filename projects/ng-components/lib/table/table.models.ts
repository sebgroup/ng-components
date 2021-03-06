import { BehaviorSubject } from "rxjs";

export interface TableServiceData<T extends {} = { [k: string]: any }> {
    /** The current table or rows to display in the table based on the current sort and page */
    rows: BehaviorSubject<T[]>;
    /** The entire data, sorted */
    sortedTable: BehaviorSubject<T[]>;
    /** The entire data, sorted and paginated */
    paginatedTable: BehaviorSubject<T[][]>;
    /** The Header List of the entire data with all the column info to be used with the table UI */
    headerList: BehaviorSubject<TableHeaderListItem<T>[]>;
    /** The information of which column the table is sorted by and extra info to be used with the table UI */
    sortInfo: BehaviorSubject<SortInfo<T>>;
    /** The information of which which rows are currently selected mapped to the paginated table (to be used with the table UI) */
    selectedRows: BehaviorSubject<number[][]>;
    /** Are all the rows of the table are selected? */
    isAllSelected: BehaviorSubject<boolean>;
    /** The current number of the page which is being displayed */
    pageNo: BehaviorSubject<number>;
}

export interface TableServiceHandlers<T extends {} = { [k: string]: any }> {
    changeColumns: (newColumns: TableConfig<T>["columns"]) => void;
    sort: (selectedColumn: string) => void;
    changePage: (newIndex: number) => void;
    selectRow: (index: number) => void;
    selectAllRows: () => void;
}

export interface TableServiceDataAndHandlers<T extends {} = { [k: string]: any }> {
    get: TableServiceData<T>;
    handle: TableServiceHandlers<T>;
}
/** The name of a property that is possible to subscribe to from the Table Service */
export type TableServiceSubject =
    | "currentSortInfo"
    | "selectedRows"
    | "isAllSelected"
    | "currentPageIndex"
    | "tableHeaderList"
    | "sortedTable"
    | "paginatedTable"
    | "currentTable";

export type TableServiceAction = "changeColumns" | "changeSort" | "changePagination" | "selectRow" | "selectAllRows";

/** The type of a data the values in a column represent  */
export type TableHeaderListValueType = "number" | "string" | "date" | "datetime" | "bool" | "custom-html";

/** The optional theme of the table header  */
export type TableTHeadTheme = "light" | "dark";

/** The maximum breakpoint with which to have a responsive table */
export type TableResponsiveBreakpoint = "sm" | "md" | "lg" | "xl";

/** The Table config object Interface */
export interface TableConfig<T extends {} = { [k: string]: any }> {
    /** a map of every column name what type of data it represents */
    types?: { [key in keyof T]?: TableHeaderListValueType };
    /** an optional map of column names and what label to display as column */
    labels?: { [key in keyof T]?: string };
    /** an optional map of column names and what order they should appear in */
    order?: { [key in keyof T]?: number };
    /** an optional initial sort */
    sort?: SortInfo<T>;
    /** an optional array of column names which shall not be displayed */
    columns?: Array<keyof T>;
    /** Pagination config */
    pagination?: {
        /** number of maximum items to display per page */
        maxItems: number;
    };
}

/** Table Header List Item Interface */
export interface TableHeaderListItem<T extends {} = {}> {
    /** The label displayed */
    label: string;
    /** the key selector corresponding to to the TableList Item which this column is targeting */
    tableKeySelector: keyof T;
    /** the type of value: string, date or number */
    valueType: TableHeaderListValueType;
}

/** The object emmited when the table row is clicked */
export interface TableRowClickedEvent<T extends {} = {}> {
    item: T;
    index: number;
}

/** The information on the currently selected sort: column name, type and asc/desc  */
export interface SortInfo<T extends {} = { [k: string]: any }> {
    /** column name */
    column: keyof T;
    /** is ascending (false for descending) */
    isAscending: boolean;
    /** the type of value: string, date or number */
    type?: TableHeaderListValueType;
}
