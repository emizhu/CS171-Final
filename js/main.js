 //Load Data
queue()
    .defer(d3.csv,"data/atussum_0317_two_digits_by_age.csv")
    // .defer(d3.json,"data/myWorldFields.json")
    .await(createVis);


 function createVis(error, data) {
     if (error) {
         console.log(error);
     }

     var diffvis = new DiffVis("diffvis", 30, 10, 20, 10);
     var stackedchart = new StackedChart("stackedchart", data);
     // var lifestyle = new LifeStyle("lifestyle", data);

     console.log(data);

 }