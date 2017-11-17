/**
 * Created by wisdom on 2017/8/30.
 */
export const zhengzhou = {
    CF: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'YearRange',
            title: '年度'
        },
        {
            key: 'Level',
            title: '等级'
        },
        {
            key: 'AreaName',
            title: '地区'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    FG: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        }
    ],
    JR: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'Type',
            title: '类别'
        },
        {
            key: 'Level',
            title: '等级'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    LR: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'Type',
            title: '类别'
        },
        {
            key: 'Level',
            title: '等级'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    MA: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    OI: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'Level',
            title: '等级'
        },
        {
            key: 'IsTransgenosis',
            title: '是否转基因'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }],
    PM: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'YearRange',
            title: '年度'
        },
        {
            key: 'Level',
            title: '等级'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    RI: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'Type',
            title: '类别'
        },
        {
            key: 'Level',
            title: '等级'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    RM: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'Type',
            title: '类别'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    RS: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    SF: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号',
            render: (h, params) => {
                if (params.row.WarehouseType === '仓库') {
                    return params.row.WarehouseNo
                } else {
                    return params.row.FactoryWNo
                }
            }
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    if (params.row.WarehouseType === '仓库') {
                        return h('div',
                            {
                                class: 'WarehouseNametextRight'
                            }, '--' + params.row.WarehouseName)
                    } else {
                        return h('div',
                            {
                                class: 'WarehouseNametextRight'
                            }, '--' + params.row.FactoryWName)
                    }
                } else {
                    if (params.row.WarehouseType === '仓库') {
                        return h('div',
                            {
                                class: 'WarehouseNametext'
                            }, params.row.WarehouseName)
                    } else {
                        return h('div',
                            {
                                class: 'WarehouseNametext'
                            }, params.row.FactoryWName)
                    }
                }
            }
        },
        {
            key: 'WarehouseType',
            title: '仓库/厂库'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    SM: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号',
            render: (h, params) => {
                if (params.row.WarehouseType === '仓库') {
                    return params.row.WarehouseNo
                } else {
                    return params.row.FactoryWNo
                }
            }
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    if (params.row.WarehouseType === '仓库') {
                        return h('div',
                            {
                                class: 'WarehouseNametextRight'
                            }, '--' + params.row.WarehouseName)
                    } else {
                        return h('div',
                            {
                                class: 'WarehouseNametextRight'
                            }, '--' + params.row.FactoryWName)
                    }
                } else {
                    if (params.row.WarehouseType === '仓库') {
                        return h('div',
                            {
                                class: 'WarehouseNametext'
                            }, params.row.WarehouseName)
                    } else {
                        return h('div',
                            {
                                class: 'WarehouseNametext'
                            }, params.row.FactoryWName)
                    }
                }
            }
        },
        {
            key: 'WarehouseType',
            title: '仓库/厂库'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    SR: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'YearRange',
            title: '年度'
        },
        {
            key: 'Level',
            title: '等级'
        },
        {
            key: 'Brand',
            title: '品牌'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    TA: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'Brand',
            title: '品牌'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    WH: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseNo',
            title: '仓库编号'
        },
        {
            key: 'WarehouseName',
            title: '仓库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.WarehouseName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.WarehouseName)
                }
            }
        },
        {
            key: 'Type',
            title: '类别'
        },
        {
            key: 'Level',
            title: '等级'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Prediction',
            title: '有效预报'
        }
    ],
    ZC: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'FactoryWNo',
            title: '厂库编号'
        },
        {
            key: 'WarehouseName',
            title: '厂库名称',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    return h('div',
                        {
                            class: 'WarehouseNametextRight'
                        }, '--' + params.row.FactoryWName)
                } else {
                    return h('div',
                        {
                            class: 'WarehouseNametext'
                        }, params.row.FactoryWName)
                }
            }
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        },
        {
            key: 'Premium',
            title: '升贴水'
        }
    ],
    CY: [
        {
            key: 'VariName',
            title: '品种'
        }
    ],
    bu: [
        {
            key: 'VariName',
            title: '品种'
        },
        {
            key: 'WarehouseName',
            title: '仓库/分库',
            render: (h, params) => {
                if (params.row.ParentWName) {
                    if (params.row.WarehouseName || params.row.WarehouseType === '仓库') {
                        return h('div',
                            {
                                class: 'WarehouseNametextRight'
                            }, '--' + params.row.WarehouseName)
                    } else {
                        return h('div',
                            {
                                class: 'WarehouseNametextRight'
                            }, '--' + params.row.FactoryWName)
                    }
                } else {
                    if (params.row.WarehouseName || params.row.WarehouseType === '仓库') {
                        return h('div',
                            {
                                class: 'WarehouseNametext'
                            }, params.row.WarehouseName)
                    } else {
                        return h('div',
                            {
                                class: 'WarehouseNametext'
                            }, params.row.FactoryWName)
                    }
                }
            }
        },
        {
            key: 'WarehouseType',
            title: '仓库/厂库'
        },
        {
            key: 'PreWNum',
            title: '昨日仓单量'
        },
        {
            key: 'NowWNum',
            title: '今日仓单量'
        },
        {
            key: 'WNumChange',
            title: '增减'
        }
    ]
}
