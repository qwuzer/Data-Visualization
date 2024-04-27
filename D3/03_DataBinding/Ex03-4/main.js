

d3.csv("ages.csv").then(data =>{
    console.log(data);

    data.forEach(function(d){
        d.age = Number(d.age);
    });

    console.log(data);

    let rects = d3.select("svg")
                  .selectAll("rect")
                  .data(data);
    
    rects.enter()
         .append("rect")
         .attr("x", 0)
         .attr("y", function(d, i){
             return i*15;
         })
         .attr("width", function(d, i){
             return d.age * 5;
         })
         .attr("height", 10)
         .attr("fill", function(d, i){
             if( d.name === "Jessica"){
                 return "red";
             }else{
                 return "blue";
             }
         });
    }
).catch(function(error){
    console.log(error);
});

