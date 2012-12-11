I School Interest Graph
=====================

The I School Interest Graph is an interactive infographic designed to show shared academic interests among I School students.

## Team Members
* [Carinne Johnson] - Language Analysis, Dictionary Creation, Data Collection 
* [Naila Khalawi] - Data Collection, Javascript Wizard, Category Filters 
* [Taeil Kwak] - Info Vizualization, D3 
* [Max Gutman] - Info Vizualization, D3  

## Project Description (what it does, how you went about it, etc.)
We wanted to analyze connections between I School students based on their common interests. We started by manually analyzing the data to determine a "white list" of the 12 most commonly listed categories. Because the "language problem" persists, even among I School students, we created a dictionary to analyze the category of each focus, regardless of the way it is listed on the I School website. Our code begins by scraping the I School website for four pieces of information: name, degree year, specified areas of focus, and photo url. Then it analyzes the data against the category dictionary and counts each instance of each category to create the size and placement of the "interest nodes" (the large blue circles in our graph). Finally, it places the individual students as nodes connected to each of their interests. The filters in the right column allow viewers to customize the results they want to see.

### Technologies Used

We used HTML5, CSS3, JavaScript (mostly jQuery), and D3 for visualization. 

### URL of the repository on github
https://github.com/nailak/iolab_proj4

### Live URL of where it’s hosted
http://people.ischool.berkeley.edu/~taeil2/ischoolppl/graph.html
