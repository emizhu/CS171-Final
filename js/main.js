//create global arrays
var dataAge = [];
var dataLifestyle = [];
var dataCat = [];
var lifestyle;
var stackedchart;

//set height of columns to fill page
$(".page_row")
    .css("height",$(window).height()+"px");


 new fullpage('#fullpage', {

     navigation: true,
     menu: '#myMenu',
     anchors: ['page_01', 'page_02', 'page_03', 'page_04', 'page_05','page_06', 'page_07', 'page_08', 'page_09'],
     navigationPosition: 'right',
     navigationTooltips: ['01', '02', '03', '04', '05','06', '07', '08', '09'],
     showActiveTooltip: true,
     slidesNavigation: true,
     sectionsColor: ['white', '#404040', 'white', '#404040','white','#404040','white','#404040','#404040'],
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

// //nest data by year
//
     console.log(data);
     var keys = dataCategory.columns;

// filter data
     data.forEach(function (d) {
         //convert string to number
         var i;
         for (i = 0; i < keys.length; i++) {
             var category = keys[i];
             if (category[0] == 't') {
                 d[category] = +d[category];
             }
         }
     });

     // Married, full-time employed, currently working women vs men with children in household
     // Childcare = 0301 + 0302 + 0303 codes
     var gendervis = new DiffVis("gendervis", 88.91, 59.72, 111.89, 51.12, "Women", "Men", "Childcare", "Housework");
     var transvis = new DiffVis("transvis", 48.52, 36.54, null, null, "Urban Residents", "Nonurban Residents", "Work Transportation", null);
     var leisurevis = new DiffVis("labor", 407.9, 230.9, null, null, "Off the Labor Market", "Currently Employed", "Lesiure Time", null);

     var colwidth = $('.col-md-3').width();
     console.log(colwidth);

     $('.fp-controlArrow.fp-prev').css("left", colwidth+60);

     if (colwidth < 350) {
         $('.col-md-3 p').css("padding-left", 20);
         $('.col-md-3 p').css("font-size", 11);
     }

     stackedchart = new StackedChart("stackedchart", data, dataCategory, detail);

     //create visualization for different lifestyles
     lifestyle = new LifeStyle("lifestyle", data_lifestyle);

     // var demoVis = new DemoVis("demovis", data_demo);
     var demoVis = new DemoVis();


 }


function onToggle() {
    lifestyle.filterData();
}
