$("document").ready(function() {
  //load webpage from php
  $.ajax({
    // Manually input your url here:
    url: 'http://people.ischool.berkeley.edu/~taeil2/ischoolppl/curl2.php #content-area',
    success: function(data) {
      // Pulls data from the ischool ppl website
      cleanText(data);
      // console.log all important objects available
      console.log('phraseCountArray:');
      console.log(phraseCountArray);
      console.log('focusCategory:');
      console.log(focusCategory);
      console.log('categoryFocus:');
      console.log(categoryFocus);
      console.log('students:')
      console.log(students);
      // create graph
      createGraphData();
      initializeNodes();
    }
  });
});

Array.prototype.pushUnique = function (item){
  if(this.indexOf(item) == -1) {
    this.push(item);
    return true;
  }
  return false;
}

function createGraphData() {

  // Array of categories {"Big Data": 0, "Design": 1, ...}
  for (var studentKey in students){
    var studentCategories = students[studentKey][kCategory];
    //console.log(students[studentKey], studentCategories);
    for(var categoryKey in studentCategories) {
      var category = studentCategories[categoryKey];
      if(category && category.substring && !(category in categories)) {
        categories[category] = Object.keys(categories).length;
      }
    }
  }

  // Add categories to nodes
  for (var categoryKey in categories) {
    masterNodes.push({"name": categoryKey, "group": 2, "size":phraseCountArray[categoryKey], "on":false});
  }

  categoryCount = masterNodes.length;
  studentCount = categoryCount;

  // Create nodes and links
  for (var studentKey in students){
    var student = students[studentKey];
    var studentCategories = students[studentKey][kCategory];
    // List of Arrays of student nodes [{"name": "Bob", "url": "", ...}]
    masterNodes.push({
      "name": student[kName],
      "group": 1,
      "url": student[kImage],
      "class": student[kClass],
      "id": student[kName].replace(/\s/g, "").replace(/\(|\)/g, "").toLowerCase(),
      "on":false
    });
    for(var categoryKey in studentCategories) {
      var category = studentCategories[categoryKey];
      if(category && category.substring) {
        // Array of links {"source":1,"target":0,"value":100}
        masterLinks.push({
            "source": studentCount,
            "target": categories[category],
            "value": 1
        });
      }
    }
    studentCount += 1;
  }
}

//Initialize variables and graph

var masterNodes = [],
  masterLinks = [],
  nodes = [],
  links = [],
  categories = {},
  kName = 0,
  kImage = 1,
  kClass = 2,
  kCategoryRaw = 3,
  kCategory = 4;
  linkedByIndex = {};
  categoryCount = 0;
  studentCount = 0;

var w = 1000,
  h = 1000,
  r = 5;

var color = d3.scale.category20();

var svg = d3.select("#chart").append("svg")
  .attr("viewBox", "0 0 " + w + " " + h )
  // .attr("width", w)
  // .attr("height", h);

var force = d3.layout.force()
  .gravity(.05)
  .charge(-150)
  .linkDistance(30)
  .linkStrength(.1)
  .size([w, h]);

force
  .distance(function(d) {
    return d.value
  })
  .nodes(nodes)
  .links(links);

// node.attr("cx", function(d) { return d.x = Math.max(r, Math.min(w - r, d.x)); })
//         .attr("cy", function(d) { return d.y = Math.max(r, Math.min(h - r, d.y)); });

force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + Math.min(Math.abs(d.x), w) + "," + Math.min(Math.abs(d.y), h) + ")"; });
});

var link = svg.selectAll(".link");
var node = svg.selectAll(".node");

function initializeNodes(){
  // var i=0;
  // for (var key in categories){
  //   nodes.push(masterNodes[i]);
  //   i++;
  // }
  masterNodes.forEach(function(d) {
    nodes.push(d);
  });
  console.log('nodes:')
  console.log(nodes);
  start();
}

// These are the functions for adding and removing nodes and links

function expandNode(categoryName){
  // First, close the node to avoid repeats
  closeNode(categoryName);
  masterLinks.forEach(function(d){
    // masterLinks actually changes when you push an object to links. console.log masterLinks to see. The 2nd part of the if accomodates for this change.
    if (d.target == categories[categoryName] || d.target.index == categories[categoryName]){
      links.push(d);
      // If the source index matches the node index, show that node
      var nodeIndex = d.source;
      nodes.forEach(function(e){
        if (e.index == nodeIndex){
          e.on = true;
          showPerson(e);
        }
      });
    }
  });
  updateLinks();

  // add links and nodes to that node
}

function showPerson(person){
  svg.select("#"+person.id+"circ").attr("r", r);
  svg.select("#"+person.id+"text").text(person.name);
}

function hidePerson(person){
  svg.select("#"+person.id+"circ").attr("r", 0);
  svg.select("#"+person.id+"text").text("");
}

function closeNode(categoryName){
  var i = 0;
  var spliceCounter = [];
  links.forEach(function(d){
    if (d.target.name == categoryName){
      spliceCounter.push(i);
    }
    i++;
  });
  var removedItems = 0;
  spliceCounter.forEach(function(d){
    links.splice(d-removedItems,1);
    removedItems++;
  });
  updateLinks();
  // remove all links tied to the node
}

function expandPerson(){
  // remove all links tied to the node
  // add all links tied to the node
}

function closePerson(){
  // remove the node and links tied to the node
}




        

function start(){
  node = node.data(force.nodes(), function(d) { return d.id;});
  node.enter().append("g")
    .call(force.drag)
    .attr("class", "node");
  node.append("circle")
    .attr("cursor", "pointer")
    .attr("id", function(d) { return d.id+"circ"; })
    //.style("fill", "#A1B9E6")
    .style("fill", function(d) {
      if (d.class == "MIMS 2014") {
        return "#aec7e8";
      } else if (d.class == "MIMS 2013") {
        return "#c5b0d5";
      } else if (d.class == "Ph.D. Student") {
        return "#ffbb78";
      } else {
        return "#6baed6";
      }
    })
    .style("stroke", function(d) { return d3.rgb(color(d.group)).darker(); })
    .on("click", function(d) {
      if (d.group ==1){
        // enter functions for expanding or hiding person
        console.log(d);
      }
      // If clicking a group, expand that group
      else{
        if (d.on == false){
          expandNode(d.name);
          d.on = true;
        }
        else{
          closeNode(d.name);
          d.on = false;
        }
      }
    })
    .attr("r", function(d) {
      if(d.group == 1) {
        return 0;
      }
      else {
        return d.size*1.5;
      }
    });

  node.append("text")
    .attr("dx", -30)
    .attr("dy", 20)
    .attr("id", function(d) { return d.id+"text"; })
    .attr("class", function(d) {
      if(d.group == 1) {
        return "student";
      }
      else {
        return "category";
      }
    })
    .text(function(d) {
      if(d.group == 2) {
        return d.name;
      }
    });

  node.exit().remove();

  force.start();
}

function updateLinks() {
  link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
  link.enter().append("line").attr("class", "link");
  link.exit().remove();

  
  // This code needs to be redone, or the links will appear on top of the nodes...
  node = node.data(force.nodes(), function(d) { return d.id;});
  node.enter().append("g")
    .call(force.drag)
    .attr("class", "node");
  node.append("circle")
    .attr("cursor", "pointer")
    .attr("id", function(d) { return d.id+"circ"; })
    //.style("fill", "#A1B9E6")
    .style("fill", function(d) {
      if (d.class == "MIMS 2014") {
        return "#aec7e8";
      } else if (d.class == "MIMS 2013") {
        return "#c5b0d5";
      } else if (d.class == "Ph.D. Student") {
        return "#ffbb78";
      } else {
        return "#6baed6";
      }
    })
    .style("stroke", function(d) { return d3.rgb(color(d.group)).darker(); })
    .on("click", function(d) {
      if (d.group ==1){
        // enter functions for expanding or hiding person
        console.log(d);
      }
      // If clicking a group, expand that group
      else{
        if (d.on == false){
          expandNode(d.name);
          d.on = true;
        }
        else{
          closeNode(d.name);
          d.on = false;
        }
      }
    })
    .attr("r", function(d) {
      if(d.group == 1) {
        return 0;
      }
      else {
        return d.size*1.5;
      }
    });

  node.append("text")
    .attr("dx", -30)
    .attr("dy", 20)
    .attr("id", function(d) { return d.id+"text"; })
    .attr("class", function(d) {
      if(d.group == 1) {
        return "student";
      }
      else {
        return "category";
      }
    })
    .text(function(d) {
      if(d.group == 2) {
        return d.name;
      }
    });
  // up to here

  node.exit().remove();
  
  force.start(); //Note: This changes the format of links

  // Only nodes with connections are displayed

  // Get a list of people with links
  var linkedPeople = [];
  links.forEach(function(d){
    linkedPeople.push(d.source.index);
  });
  console.log(linkedPeople);

  // First hide everyone 
  nodes.forEach(function(d){
    if (d.group == 1){
      hidePerson(d);
      // Then reshow everyone with links
      for (var i=0;i<linkedPeople.length;i++){
        if (d.index == linkedPeople[i]){
          showPerson(d);
        }
      }
    }
  });

}