import request from "@/utils/request";

const prefix = `/business`;
export class WorkApi {
  static list(data) {
    return request({
      url: prefix + "/task/pageList",
      method: "post",
      params: {},
      data,
    });
  }
  static repairList(data) {
    return request({
      url: prefix + "/repair/pageList",
      method: "post",
      params: {},
      data,
    });
  }

  static detail(id) {
    return request({
      url: prefix + "/" + id,
      method: "get",
      params: {},
    });
  }

  static getCount(data) {
    return request({
      url: prefix + "/task/count-unfinished",
      method: "post",
      params: {},
      data,
    });
  }
  static getUncompletedWork(data) {
    return request({
      url: prefix + "/repair/list-uncompleted",
      method: "post",
      params: {},
      data,
    });
  }
}
export class MaintenanceApi {
  static detail(id) {
    return request({
      url: prefix + "/maintenance/" + id,
      method: "get",
      params: {},
    });
  }
  static planDetail(id) {
    return request({
      url: prefix + "/maintenance-plan/" + id,
      method: "get",
      params: {},
    });
  }
  static itemList(data) {
    return request({
      url: prefix + "/maintenance-benchmark/item/list",
      method: "post",
      params: {},
      data,
    });
  }
  static handle(data) {
    return request({
      url: prefix + "/maintenance/handle",
      method: "post",
      params: {},
      data,
    });
  }
  static updateItem(data) {
    return request({
      url: prefix + "/maintenance-plan/item/update",
      method: "post",
      params: {},
      data,
    });
  }
}
export class InspectionkApi {
  static detail(id) {
    return request({
      url: prefix + "/inspection/" + id,
      method: "get",
      params: {},
    });
  }
  static planDetail(id) {
    return request({
      url: prefix + "/inspection-plan/" + id,
      method: "get",
      params: {},
    });
  }
  static itemList(data) {
    return request({
      url: prefix + "/inspection-benchmark/item/list",
      method: "post",
      params: {},
      data,
    });
  }
  static handle(data) {
    return request({
      url: prefix + "/inspection/handle",
      method: "post",
      params: {},
      data,
    });
  }
  static updateItem(data) {
    return request({
      url: prefix + "/inspection-plan/item/update",
      method: "post",
      params: {},
      data,
    });
  }
}

const stocktakingPrefix = `${prefix}/stocktaking`;
export class StocktakingApi {
  static detail(id) {
    return request({
      url: `${stocktakingPrefix}/record/${id}`,
      method: "get",
    });
  }

  static unfinishedManifestList(data) {
    return request({
      url: `${stocktakingPrefix}/unfinished-manifest-list`,
      method: "post",
      data,
    });
  }
  static finishedManifestList(data) {
    return request({
      url: `${stocktakingPrefix}/finished-manifest-list`,
      method: "post",
      data,
    });
  }
  static save(data) {
    return request({
      url: `${stocktakingPrefix}/save`,
      method: "post",
      data,
    });
  }
  static update(data) {
    return request({
      url: `${stocktakingPrefix}/update`,
      method: "post",
      data,
    });
  }
  static finish(data) {
    return request({
      url: `${stocktakingPrefix}/finish`,
      method: "post",
      data,
    });
  }
}

export class InventoryApi {
  static detailPage(data) {
    return request({
      url: prefix + "/inventory/count/detail/pageList",
      method: "post",
      params: {},
      data,
    });
  }
  static confirm(data) {
    return request({
      url: prefix + "/inventory/confirm",
      method: "post",
      params: {},
      data,
    });
  }
  static list(data) {
    return request({
      url: prefix + "/inventory/list",
      method: "post",
      params: {},
      data,
    });
  }
}
export class RepairApi {
  static detail(id) {
    return request({
      url: prefix + "/repair/" + id,
      method: "get",
      params: {},
    });
  }
  static deviceDetail(id) {
    return request({
      url: prefix + "/device/" + id,
      method: "get",
      params: {},
    });
  }

  static handle(data) {
    return request({
      url: prefix + "/repair/handle",
      method: "post",
      params: {},
      data,
    });
  }

  static deviceByPosition(data) {
    return request({
      url: prefix + "/device/list-by-position",
      method: "post",
      params: {},
      data,
    });
  }

  static devicePositionTree(data) {
    return request({
      url: prefix + "/factory-model/tree",
      method: "post",
      params: {},
      data,
    });
  }

  static preHandle(data) {
    return request({
      url: prefix + "/repair/pre-handle",
      method: "post",
      params: {},
      data,
    });
  }
  static add(data) {
    return request({
      url: prefix + "/repair/add",
      method: "post",
      params: {},
      data,
    });
  }
  static finish(data) {
    return request({
      url: prefix + "/repair/finish",
      method: "post",
      params: {},
      data,
    });
  }
  static delete(data) {
    return request({
      url: prefix + "/repair/delete",
      method: "post",
      params: {},
      data,
    });
  }
}
