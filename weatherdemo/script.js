 // 在 script.js 的顶部添加颜色数组
const cityColors = [
  { bg: '#667eea', text: '#fff' }, // 渐变蓝紫
  { bg: '#764ba2', text: '#fff' }, // 深紫
  { bg: '#43cea2', text: '#fff' }, // 青绿色
  { bg: '#ff9a9e', text: '#fff' }, // 粉红
  { bg: '#fad961', text: '#333' }, // 明亮黄
  { bg: '#4f00c0', text: '#fff' }, // 深蓝紫
  { bg: '#2980b9', text: '#fff' }, // 宝石蓝
  { bg: '#e67e22', text: '#fff' }, // 橙色
  { bg: '#27ae60', text: '#fff' }, // 绿色
];
 
 // 加载城市数据
$.ajax({
    url: 'cities.json',
    dataType: 'json',
    success: function(data) {
        generateCityItems(data);
    },
    error: function(xhr, status, error) {
        console.error('加载城市数据失败:', error);
    }
});

// 动态生成城市项
function generateCityItems(cities) {
    var container = $('#city-container');
    container.empty();

    cities.forEach(function(city) {
        // 随机选择一种颜色
        const colorStyle = cityColors[Math.floor(Math.random() * cityColors.length)];

        var cityItem = $('<div>').addClass('city-item');

        cityItem.data('city-id', city.id);

        // 设置内联样式
        cityItem.css({
            backgroundColor: colorStyle.bg,
            color: colorStyle.text
        });

        var cityName = $('<div>').addClass('city-name').text(city.name);
        var cityIcon = $('<img>').addClass('city-icon').attr('src', city.iconUrl);

        cityItem.append(cityIcon);
        cityItem.append(cityName);

        container.append(cityItem);
    });
}

// 城市点击事件处理
$(document).on('click', '.city-item', function() {
    var selectedCityId = $(this).data('city-id');
    console.log('选中的城市ID:', selectedCityId);
    getWeatherByCityId(selectedCityId);
});

// 获取天气信息
function getWeatherByCityId(cityId) {
    var apiKey = "4a775bfb5ca645e1de297c723e7feaf2";
    
    // 假设城市ID对应高德需要的城市名称
    var cityNames = {
        "101": "北京",
        "102": "上海",
        "103": "广州",
        "104": "深圳",
        "105": "杭州",
        "106": "南京",
        "107": "西安"
    };
    
    var cityName = cityNames[cityId];
    
    if (!cityName) {
        console.error('不支持的城市ID:', cityId);
        return;
    }
    
    // 调用高德天气 API
    $.ajax({
        url: "https://restapi.amap.com/v3/weather/weatherInfo",
        data: {
            key: apiKey,
            city: cityName,
            extensions: "base"
        },
        success: function(response) {
            if (response.status === "1" && response.lives && response.lives.length > 0) {
                var weatherData = response.lives[0];
                
                // 将高德返回的数据格式转换为我们需要的格式
                var formattedWeather = {
                    name: weatherData.city,
                    temperature: weatherData.temperature + "°C",
                    iconUrl: getWeatherIconUrl(weatherData.weather),
                    description: weatherData.weather
                };
                
                displayWeatherCard(formattedWeather);
            } else {
                console.error("获取天气信息失败:", response.info);
            }
        },
        error: function(xhr, status, error) {
            console.error("请求天气API失败:", error);
        }
    });
}

// 根据天气情况返回对应的图标URL
function getWeatherIconUrl(weather) {
    var icons = {
        "晴": "https://ts1.tc.mm.bing.net/th/id/R-C.5fb9b2f5fdd52aa4ee5c5983bbfe03d1?rik=cCOUke0ZQSgScw&riu=http%3a%2f%2fpic.sc.chinaz.com%2ffiles%2fpic%2fpic9%2f201602%2fapic19010.jpg&ehk=sMnPnVvnrF%2bUHMoaJ0jGkeg%2f%2b65MbzYni3xKAnqJkRo%3d&risl=&pid=ImgRaw&r=0",
        "多云": "https://pic.52112.com/180710/JPG-180710_1212/8lCDTqlTfc_small.jpg",
        "阴": "https://ts1.tc.mm.bing.net/th/id/R-C.e739b1b704d94a5bff8c51bcee05e91d?rik=OibGeKJrwKmieA&riu=http%3a%2f%2fmap.cgahz.com%2fuploads%2fallimg%2f150608%2f1-15060QTR1316.jpg&ehk=fyRZxCExnpxYiQy5RKm9ZtNX6Y6seJze4hqBtrttHzU%3d&risl=&pid=ImgRaw&r=0",
        "雷阵雨": "https://img.ixintu.com/upload/jpg/20210531/979a56ecc772d54c9def8374d2be222e_91648_800_829.jpg!con",
        "雨": "https://img.tukuppt.com/ad_preview/00/10/72/5c9936506e007.jpg!/fw/780",
        "雪": "https://bpic.588ku.com/back_origin_min_pic/21/07/09/00572faa3f1d30a6489da0ec64134963.jpg!/fw/750/quality/99/unsharp/true/compress/true",
        "雾":"https://ts1.tc.mm.bing.net/th/id/R-C.979a4246ccf51cfa5fa00ce0da50ae8e?rik=6iyjNStVW3djOA&riu=http%3a%2f%2fpic.baike.soso.com%2fugc%2fbaikepic2%2f20889%2f20170331142216-1483345497.jpg%2f0&ehk=Mdu73vymgXuiQw3RPIbWLwxzn0XT2DXamyvRh1iybzw%3d&risl=&pid=ImgRaw&r=0"
    };
    
    return icons[weather] || "default.png";
}
const weatherBackgrounds = {
  "晴": "linear-gradient(135deg, #4fbeb7, #45a7c5)",
  "多云": "linear-gradient(135deg, #bdc3c7, #95a5a6)",
  "阴": "linear-gradient(135deg, #95a5a6, #7f8c8d)",
  "雷阵雨": "linear-gradient(135deg, #2c3e50, #4ca1af)",
  "雨": "linear-gradient(135deg, #3498db, #2980b9)",
  "雪": "linear-gradient(135deg, #ecf0f1, #bdc3c7)",
  "default": "linear-gradient(135deg, #e67e22, #f39c12)"
};
// 显示天气卡片
function displayWeatherCard(weather) {
    var container = $('#weather-container');
    container.empty();

    var weatherCard = $('<div>').addClass('weather-card');

    // 设置背景色
    const bg = weatherBackgrounds[weather.description] || weatherBackgrounds.default;
    weatherCard.css('background', bg);

    var cityName = $('<div>').addClass('weather-city').text(weather.name);
    var temperature = $('<div>').addClass('weather-temperature').text(weather.temperature);
    var weatherIcon = $('<img>').addClass('weather-icon').attr('src', weather.iconUrl);
    var description = $('<div>').addClass('weather-description').text(weather.description);

    weatherCard.append(cityName);
    weatherCard.append(temperature);
    weatherCard.append(weatherIcon);
    weatherCard.append(description);

    container.append(weatherCard);

    // 使用外层容器包裹卡片并添加动画类
    var cardContainer = $('<div>').addClass('weather-card-container');
    cardContainer.append(weatherCard);

    container.append(cardContainer);
}

