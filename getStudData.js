
$("document").ready(function() {
    //load webpage from php
    $("#content").load("http://people.ischool.berkeley.edu/~nkhalawi/projects/iolab_proj4/curl2.php #content-area");
    console.log(document.readyState)
});

$(window).load(function () {
	console.log(document.readyState);
	console.log(document);
	
	//event listener to get student data
    $('#getData').on("click", function() {
        // this.preventDefault();
        console.log('>> Clicked..');
        cleanText();        
    });

    function cleanText(){
        console.log('>> Scraping page..');
        all=$('.person-teaser').text();
        console.log('>>Cleaning text with regex..');

        //replace erepeated whitespaces with new line (place each item on new line)
        content=all.replace(/\s\s\s+/g,'\n'); 
        //remove 3,2,1 word email junk script  espectively
        content=content.replace(/\s+[\S+]+\s\[&#100;&#111;t\]\s[\S+]+\s\[&#100;&#111;t\]\s?[\S+]+\s\[&#97;t\]\sischool\s\[&#100;&#111;t\]\sberkeley\s\[&#100;&#111;t\]\sedu/g,""); 
        content=content.replace(/\s+[0-9a-zA-Z_\.]+\s\[&#100;&#111;t\]\s?[a-zA-Z]+\s\[&#97;t\]\sischool\s\[&#100;&#111;t\]\sberkeley\s\[&#100;&#111;t\]\sedu/g,""); 
        content=content.replace(/\s+[0-9a-zA-Z_\.]+\s\[&#97;t\]\sischool\s\[&#100;&#111;t\]\sberkeley\s\[&#100;&#111;t\]\sedu/g,"");          
        //remove phone numbers
        content=content.replace(/\d{3}-?\d{3}-?\d{4}/g,"");
        //Mark names (item before degree)
        content=content.replace(/\s+MIMS 2013/g," *name*\nMIMS 2013");
        content=content.replace(/\s+MIMS 2014/g," *name*\nMIMS 2014");
        content=content.replace(/\s+Ph.D. Student/g," *name*\nPh.D. Student");
        
        //remove leading and ending spaces
        clean=content.trim();                 

        //split at new lines and place in array
        contentArray=clean.split('\n');
        console.log(contentArray);

        //format in an object where obj[name]=[name],[year],[interests]
        count=0
        students={}
        nameFormat=/[a-zA-z]+ [a-zA-z]+/
        for (var i in contentArray){
            // if(!nameFormat.test(contentArray[i])){console.log(contentArray[i])}
            if (contentArray[i].slice(-6)=="*name*"){count+=1;name=contentArray[i].replace(' *name*','');students[name]=[name]} 
            else if (contentArray[i].slice(-8)=='@ischool'){students[name].push(contentArray[i])}
            else if (contentArray[i].slice(0,4)=='MIMS'){students[name].push(contentArray[i])}
            else if (contentArray[i].slice(0,4)=='Ph.D'){students[name].push(contentArray[i])}
            else if (contentArray[i].slice(0,6)=='Focus:'){
                focus=contentArray[i].replace(/Focus: /,"");
                students[name].push(focus);//if we want the interests as string
                // students[name].push(focus.split(','));//if we want the interests in a sub-array
            }
            else{console.log(">> Items NOT added: ");console.log(contentArray[i])}
        }
    console.log('>> Students Obj:')
    console.log(students);
    console.log(">> Print out students content: ")
    for (i in students){
        $('#result').append('<p>'+students[i]+'</p>');
        console.log(students[i])}
    }// end cleanText()

});//end on page load


    
