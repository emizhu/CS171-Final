//create global arrays
var dataAge = [];
var dataLifestyle = [];
var lifestyle;

 var textTypeInterval = 40;
 var basePause = 1000;
 var text_slide_01 ="Life expectancy for Americans is 689,328 hours (78.7 years). How would you like to spend your time?";
 var slideRun = {2:true};

 new fullpage('#fullpage', {
     anchors: ['page_01', 'page_02', 'page_03', 'page_04', 'page_05','page_06', 'page_07', 'page_08', 'page_09'],
     menu: '#myMenu',
     sectionsColor: ['white', 'lightgrey', 'white', 'white', 'white'],
     licenseKey:'OPEN-SOURCE-GPLV3-LICENSE',
    });


 //Load Data
queue()
    //age data
    .defer(d3.csv,"data/atussum_0317_two_digits_by_age.csv")
    .defer(d3.csv,"data/atussum_0317_two_digits_cat.csv")
    //lifestyle data
    .defer(d3.csv,"data/individuals_by_category_0317_removespaces.csv")
    .await(createVis);


 function createVis(error, data, dataCategory, data_lifestyle) {
     if (error) {
         console.log(error);
     }

     //dataAge = data;
     dataLifestyle = data_lifestyle;

//nest data by year

     var keys = dataCategory.columns;
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

     // Married, full-time employed, currently working women vs men with children in household
     //Childcare = 0301 + 0302 + 0303 codes
     var gendervis = new DiffVis("gendervis", 88.91, 59.72, 111.89, 51.12, "Women", "Men", "Childcare", "Housework");
     var leisurevis = new DiffVis("transvis", 48.52, 36.54, null, null, "Metropolitan", "Non-Metropolitan", "Transportation for Work", null);
     var leisurevis = new DiffVis("labor", 407.9, 230.9, null, null, "Off Labor Market", "Currently Employed", "Lesiure Time", null);

     var stackedchart = new StackedChart("stackedchart", data, dataCategory);

     //create visualization for different lifestyles
     lifestyle = new LifeStyle("lifestyle", data_lifestyle);

 }


function onToggle() {
    lifestyle.filterData();
}
