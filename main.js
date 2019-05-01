

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
     .then((response)=>{
         return response.json();
     })
     .then((data)=>{
        chart(data)
     })

     var chart = (data) =>{
        
        var month=['January','Februry','March','April','May','Jun','July','August','September','October','November','December'];

         var svg=d3.select('.chart')
                   .attr('width',1000)
                   .attr("height",700);

         var color = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"];
         
         var tooltip=d3.select('body')
                        .append('div')
                        .attr('class','tooltip')
                        .attr('id','tooltip');

                var height=400/12;
                var width=5*data.monthlyVariance.length/12;
                                    
                        // .style('posit')
         var variance = data.monthlyVariance.map(function (val) {
             return val.variance;
         });
         var minTemp = data.baseTemperature + Math.min.apply(null, variance);
         var maxTemp = data.baseTemperature + Math.max.apply(null, variance);
         
         var colorScale=d3.scaleThreshold()
             .domain((function (min, max, count) {
                 var array = [];
                 var step = (max - min) / count;
                 var base = min;
                 for (var i = 1; i < count; i++) {
                     array.push(base + i * step);
                 }
                 console.log(array)
                 return array;
             })(minTemp, maxTemp, color.length))
             .range(color);

         var xScale=d3.scaleBand()
                      .domain(data.monthlyVariance.map((d)=>{
                         return d.year;
                      }))
                      .range([0,900])
                    

         var xAxis = d3.axisBottom()
                       .scale(xScale)
                       .tickValues(xScale.domain().filter((year)=>{
                          return year%10===0;
                       }))
                       .tickFormat((year)=>{
                          var y = new Date(0);
                          y.setUTCFullYear(year);
                          var formatYear = d3.timeFormat('%Y')
                          return formatYear(y);
                       })
                       .ticks(20)
                       .tickSize(10,0)
                     
         var yScale=d3.scaleBand() 
                      .domain([0,1,2,3,4,5,6,7,8,9,10,11])
                      .range([0,400])
        
         var yAxis=d3.axisLeft()
                     .scale(yScale)
                     .tickValues(yScale.domain())
                     .tickFormat((month)=>{
                        var date=new Date(0);
                        date.setUTCMonth(month);
                        var formatMonth=d3.timeFormat('%B')
                        return formatMonth(date);
                     })
                     .tickSize(10,1)

                    svg.append('g')
                       .attr('class','y-axis')
                       .attr('id','y-axis')
                       .attr('transform','translate(60,0)')
                       .call(yAxis)

                    svg.append('g')
                       .attr('class','x-axis')
                       .attr('id','x-axis')
                       .attr('transform','translate(60,400)')
                       .call(xAxis); 
                       
                       
                    svg.selectAll('.cell').data(data.monthlyVariance)
                       .enter()
                       .append('rect')
                       .attr('class','cell')
                       .attr('data-month',(d)=>{
                           return month[d.month%12];
                       })
                       .attr('data-year',(d)=>{
                           return d.year;
                       })
                       .attr('data-temp',(d)=>{
                           return d.variance;
                       })
                       .attr('x',(d)=>{
                        return xScale(d.year)
                       })
                       .attr('y',(d)=>{
                           return yScale(d.month)
                       }) 
                       .attr('width',5)
                       .attr('height',height)
                       .attr('fill',(d)=>{
                           return colorScale(data.baseTemperature + d.variance);
                       })
                       .attr('transform',"translate(61,0)")
                       .on('mouseover',(d)=>{
                            tooltip.attr('data-year',()=>d.year).style('opacity',0.8)
                                .html(d.year+" -" + month[d['month']%12] + '<br> '+ data.baseTemperature+"<br/>"+d.variance);

                            tooltip.style('left',(d3.event.pageX)+15+'px')
                                   .style('top',(d3.event.pageY)+15+'px');
                            
                        })
                       .on('mouseout',(d)=>{
                           tooltip.style('opacity',0);
                       })  
                       
                       //title
                       svg.append('text')
                          .attr('x',-200)
                          .attr('y',10)
                          .attr('transform','rotate(-90)')
                          .text('Months');
                       
                       svg.append('text')
                          .attr('x', 400)
                          .attr('y', 450)
                          .text('Years');
         
        
         const x = d3.scaleLinear()
                     .domain(d3.extent(colorScale.domain()))
                     .rangeRound([0, 260]);

         var legend = svg.append('g')
                         .attr('id','legend')
                         .attr('transform','translate(60,450)')
                         .selectAll("rect")                         
                         .data(colorScale.range().map(d => colorScale.invertExtent(d)))
                         .join("rect")
                         .attr("height", 20)
                         .attr("x", d => x(d[0]))
                         .attr("width", d => x(d[1]) - x(d[0]))
                         .attr("fill", d => colorScale(d[0]));
                         
        var colorAxis=d3.axisBottom()
                        .scale(x)
                        .tickSize(10)
                        .tickFormat(d=>d)
                        .tickValues(colorScale.range().slice(1).map(d => parseFloat(colorScale.invertExtent(d)[0]).toFixed(2)));  

                    svg.append('g')
                       .attr('transform','translate(60,470)')
                       .call(colorAxis)

     }
