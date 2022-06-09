export namespace common {
  interface Params {
    [props: string]: unknown;
  }

  interface PaginationParams {
    pageNum: number;
    pageSize: number;
    params?: Params;
  }

  type Id = number;

  type BooleanNumber = 0 | 1;
}
