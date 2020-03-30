import {SortState} from './sort-state.model';

/**
 * model for the result of a query coming from the server
 */

export class ResultSet{
    header: DbColumn[];
    data: string[][];
    currentPage: number;
    highestPage: number;
    table: string;
    tables: string[];
    error: string;
    exception: ResultException;
    info: Debug;
    type: string;//"table" or "view"
    explorerId: number;

    constructor ( error: string ){
        this.error = error;
    }
}

/**
 * model with classified data coming form server
 */
export class ExploreSet{
    header: DbColumn[];
    dataAfterClassification: String[];
    exploreManagerId;
    graph: String;
}

export class ExplorColSet{
    [column: string]: {
    }
}

export class SelectedColSet{
    [column: string]: {
        selected: string
    }
}

/**
 * model for statistics coming from the server
 */
export class StatisticSet {
  // error: string;
  [column: string]: {
    type: string[],
    min: null,
    max: null,
    check: string[],
    sort: string
  }

  constructor() {
    // this.error = error;
  }
}

/**
 * model for filtered options coming from user input
 */
export class FilteredUserInput {
  [column: string]: {}
}


/**
 * Model for a column of a table
 */
export class DbColumn {
  //for both
  name: string;

  //for the data-table
  sort: SortState;
  dataType: string;
  filter: string;

  //for editing columns
  primary: boolean;
  unique: boolean;
  nullable: boolean;
  maxLength: string;
  defaultValue: any;

  constructor(name: string, primary: boolean = null, nullable: boolean = null, type: string = null, maxLength: string = null, defaultValue: string = null) {
    this.name = name;
    this.primary = primary;
    this.nullable = nullable;
    this.dataType = type;
    this.maxLength = maxLength;
    this.defaultValue = defaultValue;
  }

  static fromJson(obj) {
    return new DbColumn(obj.name, obj.primary, obj.nullable, obj.dataType, obj.maxLength, obj.defaultValue);
  }
}

/**
 * model for infos about the query, e.g. number of affected rows
 */
export interface Debug {
  affectedRows: number;
  generatedQuery: string;
}

/**
 * model for constraints of a table
 */
export class TableConstraint {
  name: string;
  type: string;
  deferrable: boolean;
  initially_deferred: boolean;
  columns: string[] = [];

  constructor(name: string, type: string = null, deferrable: boolean = null, initially_deferred: boolean = null) {
    this.name = name;
    this.type = type;
    this.deferrable = deferrable;
    this.initially_deferred = initially_deferred;
  }

  /**
   * add a column to a constraint (that possibly consists of multiple columns)
   */
  addColumn(col: string) {
    this.columns.push(col);
  }
}

/**
 * SQL Index of a table
 */
export class Index {
  constructor(
    private schema: string,
    private table: string,
    private name: string,
    private method: string,
    private columns: string[]
  ) {
  }
}

/**
 * Status of an import or export operation
 */
export interface Status {
  context: string;
  totalRows: number;
  currentRow: number;
  status: number;
}

/**
 * Exception in a result message
 */
export interface ResultException {
  detailMessage: string;
  stackTrace: StackTrace[];
}

/**
 * Stacktrace in a ResultException
 */
export interface StackTrace {
  declaringClass: string;
  methodName: string;
  fileName: string;
  lineNumber: number;
}
