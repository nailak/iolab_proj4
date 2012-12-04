
// ON DOC READY: LOAD STUDENT DATA FROM ISCHOOL SITE  #
//#####################################################
$("document").ready(function() {
    //load webpage from php
    $("#content").load("http://people.ischool.berkeley.edu/~nkhalawi/projects/iolab_proj4/curl2.php #content-area");
    console.log(document.readyState)
});

// ON DOC LOAD: WAIT FOR USER TO CLIC?  #
//#######################################
//Note: ideally we shouldnt need to click, problem is data still couldnt be scraped when page was loaded
//maybe set a timer that submits instead?
$(window).load(function () {
	console.log(document.readyState);
	console.log(document);
	
	//event listener to get student data
    $('#getData').on("click", function() {
        // this.preventDefault();
        cleanText();//start grabbing and cleaning loaded text        
    });

    // CLEAN THE DATA AND PUT IT INTO AN OBJ #
    //########################################
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

        //format all data in an object where obj[name]=[name,year,[interests,int,int]]
        count=0
        students={} //all student data will be added to this obj
        nameFormat=/[a-zA-z]+ [a-zA-z]+/
        for (var i in contentArray){
            // if(!nameFormat.test(contentArray[i])){console.log(contentArray[i])}
            if (contentArray[i].slice(-6)=="*name*"){count+=1;name=contentArray[i].replace(' *name*','');students[name]=[name]} 
            else if (contentArray[i].slice(-8)=='@ischool'){students[name].push(contentArray[i])}
            else if (contentArray[i].slice(0,4)=='MIMS'){students[name].push(contentArray[i])}
            else if (contentArray[i].slice(0,4)=='Ph.D'){students[name].push(contentArray[i])}
            else if (contentArray[i].slice(0,6)=='Focus:'){
                focus=contentArray[i].replace(/Focus: /,"");
                // students[name].push(focus;//if we want the interests as string
                var studFocus=focus.split(',');
                var studFocus2=[]; //will contain list with no white spaces
                for (var m in studFocus){studFocus2.push(studFocus[m].trim())}//get rid of leading /ending spaces
                students[name].push(studFocus2);//if we want the interests in a sub-array
            }
            else{console.log(">> Items NOT added: ");console.log(contentArray[i])}
        }
        //Note: for students that dont have a focus, should we add students[3]='No focus'

        console.log('>> Students Obj:')
        console.log(students);
        console.log(">> Print out students content: ")
        for (i in students){
            $('#result').append('<p>'+students[i]+'</p>');
            console.log(students[i]);
        }

        //now call function that takes student object and find assign category to each focus
        findCategories(students);

    }// end cleanText()

    // CLASSIFY EACH FOCUS VIA DICTIONARY #
    //#####################################
    //this function takes the student object, gets all 'focus' values and assigns them to categories
    function findCategories(studentObj){
        
        allFocus=[]  //list of all focus regardless of student (Phrases)
        for (i in students){for (var e in students[i][2]){allFocus.push(students[i][2][e])}}
        
        //match each to dictionary (clean interests)
        var focusCategory={}; // will contain {focus: category1, category2}
        var categoryFocus={}; // will contain {category: focus1 , focus 2}
    
        wordsDict={'design':'Design','mobile':'Mobile','interaction':'Design','hci':'Human-Computer Interaction','experience':'Design','ux':'Design','UI':'Design','management':'Management'}

        //loop throught the focus phrases, split each one, check each word against dict then classify the full phrase
        for (var i in allFocus){
            var currentFocus=allFocus[i];
            var curFocusArray=currentFocus.toLowerCase().split(" ");//resuts in array of words for that focus
            console.log('THE CURRENT FOCUS PHRASE IS: ',currentFocus," < which is split to: >",curFocusArray);

            //now loop through current focus and check if any of the words are in the dictionary
            var tempCatArray={};
            for (var focus in curFocusArray){
                var curWord=curFocusArray[focus];
                // console.log('current focus Array..');
                //tell us what category the word belongs to
                if (curWord in wordsDict){
                    // if wordsDict[curWord] in 
                    var tempCategory=wordsDict[curWord];//store the category temp
                    console.log('>> Category of word: ',curWord," - IS -",tempCategory);
             
                    //make sure category isnt already in the temp array
                    if (tempCategory in tempCatArray){console.log(">> CATEGORY: ",tempCategory," EXISTS in tempCatArray... ");}
                    else{tempCatArray[tempCategory]=tempCategory;console.log(">> CATEGORY: ",tempCategory," PUSHED to tempCatArray.. ",tempCatArray);}
                } else{console.log('>> word not in dict ..',curWord)}
            }
 
            // focusCategory end result is a list of [focus1: category1, focus2: category2, focus3: category3]  
            for (var x in tempCatArray){
                console.log('>> the focus ',currentFocus, ' belongs to category', tempCatArray[x]);
                focusCategory[currentFocus]= tempCatArray[x];
                categoryFocus[tempCatArray[x]]=[];//sets all categories as keys
            } 
        }  

        // categoryFocus end result is a list of [category: [focus1,[focus2,focus2]] 
        for (var focus in focusCategory){
            // console.log("the key is ",focus);// this is the focus 
            curCategory=focusCategory[focus];// this is the category of that focus
            categoryFocus[curCategory].push(focus);//the focus phrase (value) is appended to the array for category(key)
        }
        //check how many focus per category 
        for(var category in categoryFocus){console.log(category," category count is :",categoryFocus[category].length)}

    console.log(focusCategory);
    console.log(categoryFocus);
    }//end findCategories()

});//end on page load


    
