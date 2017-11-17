config = {
    apiBaseUrl: 'http://rcdc.wdqh.com:6789/api/usda/api/',
    oDataApiBaseUrl: 'http://rcdc.wdqh.com:6789/api/usda/odata/',
    exchDataApiUrl: 'http://rcdc.wdqh.com:6789/api/exchdata/odata/',
    ImUrl: 'http://rcdc.wdqh.com:6789/api/im/odata/',
    // 海关出口数据品种
    CustomsVari: [
        {'ExchCode': 'A', 'VariCode': 'Soybeans', 'VariName': '大豆', 'StartTime': '9', 'EndTime': '9'},
        {'ExchCode': 'A', 'VariCode': 'Soybean Oil', 'VariName': '豆油', 'StartTime': '10', 'EndTime': '10'},
        {'ExchCode': 'A', 'VariCode': 'Soybean Meal', 'VariName': '豆粕', 'StartTime': '10', 'EndTime': '10'},
        {'ExchCode': 'A', 'VariCode': 'Wheats', 'VariName': '小麦', 'StartTime': '7', 'EndTime': '7'},
        {'ExchCode': 'A', 'VariCode': 'Corn', 'VariName': '玉米', 'StartTime': '9', 'EndTime': '9'},
        {'ExchCode': 'A', 'VariCode': 'Cotton', 'VariName': '棉花', 'StartTime': '8', 'EndTime': '8'}
    ],
    // WSDE数据品种
    WsdeVari: [{'ExchCode': 'A', 'VariCode': 'Soybeans', 'VariName': '大豆', 'StartTime': '05-01', 'EndTime': '09-07'},
        {'ExchCode': 'A', 'VariCode': 'SoybeanOils', 'VariName': '豆油', 'StartTime': '05-01', 'EndTime': '10-07'},
        {'ExchCode': 'A', 'VariCode': 'SoybeanMeals', 'VariName': '豆粕', 'StartTime': '05-01', 'EndTime': '08-07'},
        {'ExchCode': 'A', 'VariCode': 'Wheat', 'VariName': '所有小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        // {'ExchCode': 'A', 'VariCode': 'Wheat-SRW', 'VariName': '软红冬小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        // {'ExchCode': 'A', 'VariCode': 'Wheat-HRW', 'VariName': '硬红冬小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        // {'ExchCode': 'A', 'VariCode': 'Wheat-HRS', 'VariName': '硬红春小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        {'ExchCode': 'A', 'VariCode': 'Corn', 'VariName': '玉米', 'StartTime': '05-01', 'EndTime': '08-07'},
        {'ExchCode': 'A', 'VariCode': 'Cotton', 'VariName': '棉花', 'StartTime': '05-01', 'EndTime': '08-07'}
    ],
    // 周度出口销售数据
    TradeVari: [{'ExchCode': 'A', 'VariCode': 'Soybeans', 'VariName': '大豆', 'StartTime': '05-01', 'EndTime': '09-07'},
        {'ExchCode': 'A', 'VariCode': 'Corn', 'VariName': '玉米', 'StartTime': '05-01', 'EndTime': '09-07'},
        {'ExchCode': 'A', 'VariCode': 'Soybean cake & meal', 'VariName': '豆粕', 'StartTime': '05-01', 'EndTime': '10-07'},
        {'ExchCode': 'A', 'VariCode': 'Soybean Oil', 'VariName': '豆油', 'StartTime': '05-01', 'EndTime': '10-07'},
        {'ExchCode': 'A', 'VariCode': 'All Wheats', 'VariName': '所有小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        {'ExchCode': 'A', 'VariCode': 'Wheat-SRW', 'VariName': '软红冬小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        {'ExchCode': 'A', 'VariCode': 'Wheat-HRW', 'VariName': '硬红冬小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        {'ExchCode': 'A', 'VariCode': 'Wheat-HRS', 'VariName': '硬红春小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        {'ExchCode': 'A', 'VariCode': 'All Upland Cotton', 'VariName': '棉花', 'StartTime': '05-01', 'EndTime': '08-07'}],
    // 周度出口检验数据
    InspectVari: [{'ExchCode': 'A', 'VariCode': 'SOYBEANS', 'VariName': '大豆', 'StartTime': '09-01', 'EndTime': '09-01'},
        {'ExchCode': 'A', 'VariCode': 'CORN', 'VariName': '玉米', 'StartTime': '09-01', 'EndTime': '09-01'},
        {'ExchCode': 'A', 'VariCode': 'WHEAT', 'VariName': '小麦', 'StartTime': '09-01', 'EndTime': '09-01'}
    ],
    // 出口合理性分析
    ExportAnalysis: [{'ExchCode': 'A', 'VariCode': 'Soybeans', 'VariName': '大豆', 'StartTime': '05-01', 'EndTime': '09-07'},
        {'ExchCode': 'A', 'VariCode': 'Corn', 'VariName': '玉米', 'StartTime': '05-01', 'EndTime': '09-07'},
        {'ExchCode': 'A', 'VariCode': 'Soybean cake & meal', 'VariName': '豆粕', 'StartTime': '05-01', 'EndTime': '10-07'},
        {'ExchCode': 'A', 'VariCode': 'Soybean Oil', 'VariName': '豆油', 'StartTime': '05-01', 'EndTime': '10-07'},
        {'ExchCode': 'A', 'VariCode': 'All Wheats', 'VariName': '所有小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        // {'ExchCode': 'A', 'VariCode': 'Wheat-SRW', 'VariName': '软红冬小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        // {'ExchCode': 'A', 'VariCode': 'Wheat-HRW', 'VariName': '硬红东小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        // {'ExchCode': 'A', 'VariCode': 'Wheat-HRS', 'VariName': '硬红春小麦', 'StartTime': '05-01', 'EndTime': '07-07'},
        {'ExchCode': 'A', 'VariCode': 'All Upland Cotton', 'VariName': '棉花', 'StartTime': '05-01', 'EndTime': '08-07'}],
    // 上海期货交易所品种
    shVari: [{'ExchCode': 'A', 'VariCode': 'cu', 'VariName': '铜'},
                {'ExchCode': 'A', 'VariCode': 'al', 'VariName': '铝'},
                {'ExchCode': 'A', 'VariCode': 'zn', 'VariName': '锌'},
                {'ExchCode': 'A', 'VariCode': 'pb', 'VariName': '铅'},
                {'ExchCode': 'A', 'VariCode': 'sn', 'VariName': '锡'},
                {'ExchCode': 'A', 'VariCode': 'ni', 'VariName': '镍'},
                {'ExchCode': 'A', 'VariCode': 'au', 'VariName': '黄金'},
                {'ExchCode': 'A', 'VariCode': 'ag', 'VariName': '白银'},
                {'ExchCode': 'A', 'VariCode': 'rb', 'VariName': '螺纹钢'},
                {'ExchCode': 'A', 'VariCode': 'wr', 'VariName': '线材'},
                {'ExchCode': 'A', 'VariCode': 'hc', 'VariName': '热轧卷板'},
                {'ExchCode': 'A', 'VariCode': 'fu', 'VariName': '燃料油'},
                {'ExchCode': 'A', 'VariCode': 'bu', 'VariName': '沥青'},
                {'ExchCode': 'A', 'VariCode': 'ru', 'VariName': '天然橡胶'}],
    // 郑州商品交易所品种
	zzVari: [{'ExchCode': 'C', 'VariCode': 'CF', 'VariName': '棉花'},
                {'ExchCode': 'C', 'VariCode': 'FG', 'VariName': '玻璃'},
                {'ExchCode': 'C', 'VariCode': 'JR', 'VariName': '粳稻'},
                {'ExchCode': 'C', 'VariCode': 'LR', 'VariName': '晚籼'},
                {'ExchCode': 'C', 'VariCode': 'MA', 'VariName': '甲醇'},
                {'ExchCode': 'C', 'VariCode': 'OI', 'VariName': '菜油'},
                {'ExchCode': 'C', 'VariCode': 'PM', 'VariName': '普麦'},
                {'ExchCode': 'C', 'VariCode': 'RI', 'VariName': '早籼'},
                {'ExchCode': 'C', 'VariCode': 'RM', 'VariName': '菜粕'},
                {'ExchCode': 'C', 'VariCode': 'RS', 'VariName': '菜籽'},
                {'ExchCode': 'C', 'VariCode': 'SF', 'VariName': '硅铁'},
                {'ExchCode': 'C', 'VariCode': 'SM', 'VariName': '锰硅'},
                {'ExchCode': 'C', 'VariCode': 'SR', 'VariName': '白糖'},
                {'ExchCode': 'C', 'VariCode': 'TA', 'VariName': 'PTA'},
                {'ExchCode': 'C', 'VariCode': 'WH', 'VariName': '强麦'},
                {'ExchCode': 'C', 'VariCode': 'ZC', 'VariName': '动力煤'},
                {'ExchCode': 'C', 'VariCode': 'CY', 'VariName': '棉纱'}],
    // 大连商品交易所品种
    dlVari: [{'ExchCode': 'B', 'VariCode': 'a', 'VariName': '豆一'},
                {'ExchCode': 'B', 'VariCode': 'b', 'VariName': '豆二'},
                {'ExchCode': 'B', 'VariCode': 'm', 'VariName': '豆粕'},
                {'ExchCode': 'B', 'VariCode': 'y', 'VariName': '豆油'},
                {'ExchCode': 'B', 'VariCode': 'p', 'VariName': '棕榈油'},
                {'ExchCode': 'B', 'VariCode': 'c', 'VariName': '玉米'},
                {'ExchCode': 'B', 'VariCode': 'cs', 'VariName': '玉米淀粉'},
                {'ExchCode': 'B', 'VariCode': 'jd', 'VariName': '鸡蛋'},
                {'ExchCode': 'B', 'VariCode': 'fb', 'VariName': '纤维板'},
                {'ExchCode': 'B', 'VariCode': 'bb', 'VariName': '胶合板'},
                {'ExchCode': 'B', 'VariCode': 'l', 'VariName': '聚乙烯'},
                {'ExchCode': 'B', 'VariCode': 'v', 'VariName': '聚氯乙烯'},
                {'ExchCode': 'B', 'VariCode': 'pp', 'VariName': '聚丙烯'},
                {'ExchCode': 'B', 'VariCode': 'j', 'VariName': '焦炭'},
                {'ExchCode': 'B', 'VariCode': 'jm', 'VariName': '焦煤'},
                {'ExchCode': 'B', 'VariCode': 'i', 'VariName': '铁矿石'}]
}

exchDataApiUrl = 'http://rcdc.wdqh.com:6789/api/exchdata/odata/'
ImApiUrl = 'http://rcdc.wdqh.com:6789/api/im/odata/'
oDataApiBaseUrl = 'http://rcdc.wdqh.com:6789/api/usda/odata/'
localStorage.setItem('exchDataApiUrl', exchDataApiUrl)
localStorage.setItem('ImApiUrl', ImApiUrl)
localStorage.setItem('oDataApiBaseUrl', oDataApiBaseUrl)