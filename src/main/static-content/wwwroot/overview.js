window.onload= function(){

	var numUsers;
	var resource = "EEG sensor";
	var secondsAgo = 1;
//	var data=[{"name":"user1","userData":[{"label":"engagement","y":0.88},{"label":"focus","y":0.816},{"label":"excitement","y":0.713},{"label":"frustration","y":0.293},{"label":"stress","y":0.175},{"label":"relaxation","y":0.512}]},
//		      {"name":"user2","userData":[{"label":"engagement","y":0.883},{"label":"focus","y":0.776},{"label":"excitement","y":0.669},{"label":"frustration","y":0.32},{"label":"stress","y":0.2},{"label":"relaxation","y":0.478}]}];
	var data=[];
	var chart = new CanvasJS.Chart("chartContainer", {
			title: {
				text: "Overview of Emotion Measurements"
			},
			axisY: {
				title: "Emotion level",
				suffix: ""
			},
			legend: {
			       cursor:"pointer",
			       //fontSize: 15,
			        itemclick: legendClick
			     },
			data:[]
		});	
		
	var updateData = function(resource, secondsAgo, callback) {
		console.log("I am here 1");

		//var localData;
	    // Fetch data from our data provider
	    provider.getData(resource, secondsAgo, function(newData) {
			console.log("I am here 1.1");

	      // Store the data locally
			dataAll.resetData();
	    	dataAll.addNewData(newData);
//	    	dataAll.removeDataOlderThan((new Date()).getTime() - 1000);
	    	//data=dataAll.getData();
//	    	str = JSON.stringify(data);
//	        console.log(str);
	    	updateNumBars(numUsers, chart);
	        if (callback) {
		       callback();
	        }	      	  
	    });	 	    
	};

	var updateNumBars = function (num, paramChart){
		console.log("I am here 2");

		paramChart.options.data=[];
		for (var i=1; i<num+1; i++) {
			if(i % 2 ==0){
				paramChart.options.data.push(
					{
						type: "column",	
						showInLegend: true,
						name: "user"+i,
						color: "Blue",
						yValueFormatString: "0.##",
						indexLabel: "{y}",
						click: dataClick,
						dataPoints: [
							{ label: "engagement", y: {} },
							{ label: "focus", y: {} },
							{ label: "excitement", y: {} },
							{ label: "frustration", y: {} },
							{ label: "stress", y: {} },
							{ label: "relaxation", y: {} }
						]					
					}			
				);
			}else{
				paramChart.options.data.push(
					{
						type: "column",	
						showInLegend: true,
						name: "user"+i,
						color: "Green",
						yValueFormatString: "0.##",
						indexLabel: "{y}",
						click: dataClick,
						dataPoints: [
							{ label: "engagement", y: {} },
							{ label: "focus", y: {} },
							{ label: "excitement", y: {} },
							{ label: "frustration", y: {} },
							{ label: "stress", y: {} },
							{ label: "relaxation", y: {} }
						]					
					}			
				);
			}	
		};		
	};
	
	var updateChart = function (paramChart , paramData) {
	//	var barColor, yVal;
		var dps = new Array(6);		
		var measurements = ["Engagement","Focus","Excitement","Frustration","Stress","Relaxation"];		
		console.log("I am here 3");
	
//		str = JSON.stringify(paramData);
//        console.log(str);
		
		for (var i=0; i< numUsers; i++){
			
			dps[i] = chart.options.data[i].dataPoints;
			
			var name = paramChart.options.data[i].name;
			
	        for (var j=0; j< numUsers; j++){
	        	
				if (paramData[j].name == name) {
					paramChart.options.data[i].dataPoints = paramData[j].userData;
				}
	        }	
			
	        for (var k= 0; k< dps[i].length; k++){	        	
	        	
				if paramChart.options.data[i].dataPoints[k].y <= 0.0 {
					paramChart.options.data[i].dataPoints[k].y = 0.01;
				}
				if paramChart.options.data[i].dataPoints[k].y >= 1.0 {
					paramChart.options.data[i].dataPoints[k].y = 0.99;
				}
				
				barColor = yVal > 0.8 ? "Red" : yVal >= 0.5 ? "Yellow" : yVal < 0.5 ? "Green" : null;
		        if (j==0 || j==1 || j==2 || j==5){
		        	barColor = yVal <0.7? "Red": chart.options.data[i].color;
		        }
		        else {
		        	barColor = yVal > 0.5 ? "Red": chart.options.data[i].color;
		        }
				dps[i][j] = {label: measurements[j] , y: yVal, color: barColor};
			}
	        chart.options.data[i].dataPoints = dps[i];
		}
		paramChart.render();

	};
	
	
	/**
	 * Provides access to records data.
	 */
	var MeasurementDataProvider = function() {
		console.log("I am here 4");

	  var _endpoint = "http://" + location.host + "/api/GetMeasurements";
	
	  /**
	   * Builds URL to fetch the number of records for a given resource in the past
	   */
	  buildUrl = function(resource, range_in_seconds) {
	    return _endpoint + "?resource=" + resource + "&range_in_seconds="
	        + range_in_seconds;
	  };
	
	  return {
	    /**
	     * Set the endpoint to request records with.
	     */
	    setEndpoint : function(endpoint) {
	      _endpoint = endpoint;
	    },
	
	    /**
	     * Requests new data and passed it to the callback provided. 
	     */
	    getData : function(resource,range_in_seconds,callback) {
	      $.ajax({
	        url : buildUrl(resource, range_in_seconds)
	      }).done(callback);
	    }
	  }
	};
	
	/**
	 * Internal representation of data. 
	 */
	var MeasurementData = function() {
		console.log("I am here 5");

	  //var localData = [];
	  var dataPerUser={name:{}, resource:{}, timestamp:{}, userData:[]};
	
	  return {
	    /**
	     * @returns {object} The internal representation of record data.
	     */
	    getData : function() {
	      return data;
	    },
	
	    resetData: function() {
	    	data=[];
	    },
	    /**
	     * Merges new data in to our existing data set.
	     *
	     * @param {object} Record data returned by our data provider.
	     */
	    addNewData : function(newMeasurementData) {
			console.log("I am here 5.1");
			
//	    	str = JSON.stringify(newMeasurementData);
//	        console.log(str);				
			var userSet = new Set();
			
	    	newMeasurementData.forEach(function(record) {
	    		
	    		userSet.add(record.host);
	    		
	    		dataPerUser={name:{}, resource:{}, timeStamp:{}, userData:[]};
	        	dataPerUser.timeStamp = record.timeStamp;
	        	dataPerUser.resource = record.resource;
	        	dataPerUser.name = record.host;
	        	
	    		// Add individual measurement
		        record.values.forEach(function(measurementValue) {
		          // create a new data series entry for this measurement
		        	measureData = 
			          {
			            label : measurementValue.measurement,
			                y : measurementValue.value
			          };
		          
		          // Update the measurement data
	
		            dataPerUser.userData.push(measureData);
	//	            data[j].push(measureData);
		        });
		        
		        data.push(dataPerUser);	
		        
	      });   
	    	numUsers= userSet.size;
	    	
//	    	str = JSON.stringify(data);
//	        console.log(str);
	    },
	    
	    removeDataOlderThan : function(currentTimeStamp) {
			console.log("I am here 5.2");

	        // For each measurement
	          $.each(data, function(measurementData) {
	        	  	          
		            // If the data point is older than the provided time
		            if (measurementData.timestamp < currentTimeStamp) {
		              // Remove the timestamp from the data        	  
		              delete measurementData;
		            }
		       });	     
	     }   
	  }
	};
	
	// event handlers
	function legendClick(e)
	{
//	  alert( "user clicked event for user: " + e.dataSeries.name );
	  window.location = 'graph.html?user='+ e.dataSeries.name;  
	}

	function dataClick(e) {
//		alert( "data clicked event for user: " + e.dataSeries.name );
		window.location = 'graph.html?user='+ e.dataSeries.name;  

	}

	
	
	var dataAll = new MeasurementData();
	var provider = new MeasurementDataProvider();
	
	// this does not work as there is asynchronous issues
//	updateData(resource, secondsAgo);
//	updateNumBars(numUsers, chart);
//	updateChart(chart, data);	
//	setInterval(function() {
//		updateData(resource, secondsAgo);
//		updateNumBars(numUsers, chart);
//		updateChart(chart, data);
//	}, 1000);
	
	
	// this is the correct way of doing it but not quite working so far	
	updateData(resource, secondsAgo, function(){
		updateChart(chart, data);
    });	
	setInterval(function() {
		updateData(resource, secondsAgo, function(){
			updateChart(chart, data);
	    });
	}, 1000);
	
	// this has been working before adding dynamic numUsers variable
//	updateNumBars(numUsers, chart); 
//	updateData(resource, secondsAgo, 
//			function(){
//		updateChart(chart, data);
//		});
//	
//	setInterval(function() {
//			
//		updateNumBars(numUsers, chart);  	
//		updateData(resource, secondsAgo, 
//				function(){
//			updateChart(chart, data);
//			});
//	}, 1000);


}//window.onload closing parenthesis
