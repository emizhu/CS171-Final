//create global arrays
var dataAge = [];
var dataLifestyle = [];
var lifestyle;

 //Load Data
queue()
    //age data
    .defer(d3.csv,"data/atussum_0317_two_digits_by_age.csv")
    //lifestyle data
    .defer(d3.csv,"data/individuals_by_category_0317_removespaces.csv")
    .await(createVis);


 function createVis(error, data_age, data_lifestyle) {
     if (error) {
         console.log(error);
     }

     dataAge = data_age;
     dataLifestyle = data_lifestyle;

     //create animated visualization
     var diffvis = new DiffVis("diffvis", 30, 10, 20, 10);

     //create visualization for different ages
     //var stackedchart = new StackedChart("stackedchart", data_age);

     //create visualization for different lifestyles
     lifestyle = new LifeStyle("lifestyle", data_lifestyle);

     //console.log(data_age);

 }


function onToggle() {
    lifestyle.filterData();
}
//
// $(document).ready(function(){
//     $("#checkboxes")
//         .on("change",function(){
//            // lifestyle.sexvalues = [];
//            // lifestyle.sexvalues.push($('#Male:checked').val());
//            // lifestyle.sexvalues.push($('#Female:checked').val());
//             lifestyle.wrangleData();
//         });
// });

