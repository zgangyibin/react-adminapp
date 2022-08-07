export const PAGEAUTH = {
  2: {
    dashboard: { title: "数据汇总", view: false },
    adminuser: {
      title: "管理员",
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    users: { title: "用户管理", view: false, edit: false },
    product: {
      title: "商品管理",
      view: true,
      add: false,
      edit: false,
      delete: false,
    },
    order: { title: "订单管理", view: true, edit: false },
  },
  1: {
    dashboard: { title: "数据汇总", view: true },
    adminuser: {
      title: "管理员",
      view: true,
      add: true,
      edit: true,
      delete: true,
    },
    users: { title: "用户管理", view: true, edit: true },
    product: {
      title: "商品管理",
      view: true,
      add: true,
      edit: true,
      delete: true,
    },
    order: { title: "订单管理", view: true, edit: true },
  },
};
