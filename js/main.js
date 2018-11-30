//create global arrays
var dataAge = [];
var dataLifestyle = [];
var dataCat = [];
var lifestyle;
var stackedchart;


 var textTypeInterval = 40;
 var basePause = 1000;
 var text_slide_01 ="Life expectancy for Americans is 689,328 hours (78.7 years). How would you like to spend your time?";
 var slideRun = {2:true};

 new fullpage('#fullpage', {

     navigation: true,
     menu: '#myMenu',
     anchors: ['page_01', 'page_02', 'page_03', 'page_04', 'page_05','page_06', 'page_07', 'page_08', 'page_09'],
     navigationPosition: 'right',
     navigationTooltips: ['01', '02', '03', '04', '05','06', '07', '08', '09'],
     showActiveTooltip: true,
     slidesNavigation: true,
     sectionsColor: ['white', 'lightgray', 'white', 'white', 'white'],
     licenseKey:'OPEN-SOURCE-GPLV3-LICENSE'
    });

//Load Data
queue()
    //age data
    .defer(d3.csv,"data/atussum_0317_two_digits_by_age.csv")
    .defer(d3.csv,"data/atussum_0317_two_digits_cat.csv")
    .defer(d3.csv,"data/atussum_0317_four_digits_by_age.csv")
    //lifestyle data
    .defer(d3.csv,"data/individuals_by_category_0317_removespaces.csv")
    .defer(d3.csv,"data/demo_2017_edit.csv")
    .await(createVis);


 function createVis(error, data, dataCategory, detail, data_lifestyle, data_demo) {
     if (error) {
         console.log(error);
     }

     //dataAge = data;
     dataLifestyle = data_lifestyle;
     dataCat = dataCategory;
     dataDetail = detail;

//nest data by year

     var keys = dataCategory.columns;
     var keyDetail = detail.columns;
     var displayData = d3.nest()
         .key(function (d) {
             return d.tuyear;
         })
         .entries(data);

//store 2017 only
     var data2017 = d3.values(displayData[14]);
     data2017 = data2017[1];

// filter data
     data2017.forEach(function (d) {
         //convert string to number
         var i;
         for (i = 0; i < keys.length; i++) {
             var category = keys[i];
             if (category[0] == 't') {
                 d[category] = +d[category];
             }
         }
     });
     data = data2017;

 // filter data
     dataDetail.forEach(function (d) {
         var i;
         for (i = 0; i < keyDetail.length; i++) {
             var cat = keyDetail[i];
             if (cat[0] == 't') {
                 d[cat] = +d[cat];
             }
         }
     });


     // Married, full-time employed, currently working women vs men with children in household
     //Childcare = 0301 + 0302 + 0303 codes
     var gendervis = new DiffVis("gendervis", 88.91, 59.72, 111.89, 51.12, "Women", "Men", "Childcare", "Housework");
     var transvis = new DiffVis("transvis", 48.52, 36.54, null, null, "Metropolitan", "Non-Metropolitan", "Transportation for Work", null);
     var leisurevis = new DiffVis("labor", 407.9, 230.9, null, null, "Off Labor Market", "Currently Employed", "Lesiure Time", null);

     stackedchart = new StackedChart("stackedchart", data, dataCategory, detail);

     //create visualization for different lifestyles
     lifestyle = new LifeStyle("lifestyle", data_lifestyle);

    // var demoVis = new DemoVis("demovis", data_demo);

 }


function onToggle() {
    lifestyle.filterData();
}
