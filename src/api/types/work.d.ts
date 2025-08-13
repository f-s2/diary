declare namespace Stocktaking {
  interface Detail {
    id: string;
    status: number;
    code: string;
    type: number;
    startTime: string;
    endTime: string;
    completionProgress: number;
    areaInfoList: AreaInfo[];
    productRelList: ProductRelItem[]
  }

  interface AreaInfo {
    areaId: string;
    areaName: string;
    completionProgress: number;
  }

  interface ProductRelItem {
    id: string;
    stocktakingId: string;
    productId: string;
    productCode: string;
    productName: string;
    productModel: string;
    productType: string;
    productTypeName: string;
    productUnit: string;
    balanceQuantity: number;
    stocktakingQuantity: number;
    differenceQuantity: number;
    remark: string;
    warehouse: string;
    goodsAllocation: string;
  }
}
