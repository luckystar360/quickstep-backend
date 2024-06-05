import { Response } from "express";

class Respond {
  res: Response;
  constructor(res: Response) {
    this.res = res;
  }

  success(
    code: number,
    data: { message: string; count?: number; data: any[] | any }
  ): Response {
    return this.res.status(code).json(data);
  }
  error(error: any): Response {
    return this.res
      .status(error.status || 500)
      .json({ message: error.message });
  }
}

class PaginationRespond {
  res: Response;
  constructor(res: Response) {
    this.res = res;
  }

  success(
    code: number,
    data: { message: string; total?: number; prevPage?: number; nextPage?: number; data: any[] | any; }
  ): Response {
    return this.res.status(code).json(data);
  }
  error(error: any): Response {
    return this.res
      .status(error.status || 500)
      .json({ message: error.message });
  }
}

export { Respond, PaginationRespond };
