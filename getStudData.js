
// CLEAN THE DATA AND PUT IT INTO AN OBJ #
//########################################
var phraseCountArray = {}; // will contain {category: count}
var focusCategory = {}; // will contain {focus: category1, category2}
var categoryFocus = {}; // will contain {category: focus1 , focus 2}
var students = {}; //all student data will be added to this obj

function cleanText(data) {
    //console.log('>> Scraping page..');
    text = $(data);
    //console.log('>>Cleaning text with regex..');
    teaser = $('.person-teaser', text).text();
    //console.log(teaser);
    //replace erepeated whitespaces with new line (place each item on new line)
    content = teaser.replace(/\s\s\s+/g, '\n');
    //remove 3,2,1 word email junk script  espectively
    content = content.replace(/\s+[\S+]+\s\[&#100;&#111;t\]\s[\S+]+\s\[&#100;&#111;t\]\s?[\S+]+\s\[&#97;t\]\sischool\s\[&#100;&#111;t\]\sberkeley\s\[&#100;&#111;t\]\sedu/g, "");
    content = content.replace(/\s+[0-9a-zA-Z_\.]+\s\[&#100;&#111;t\]\s?[a-zA-Z]+\s\[&#97;t\]\sischool\s\[&#100;&#111;t\]\sberkeley\s\[&#100;&#111;t\]\sedu/g, "");
    content = content.replace(/\s+[0-9a-zA-Z_\.]+\s\[&#97;t\]\sischool\s\[&#100;&#111;t\]\sberkeley\s\[&#100;&#111;t\]\sedu/g, "");
    //remove phone numbers
    content = content.replace(/\d{3}-?\d{3}-?\d{4}/g, "");
    //Mark names (item before degree)
    content = content.replace(/\s+MIMS 2013/g, " *name*\nMIMS 2013");
    content = content.replace(/\s+MIMS 2014/g, " *name*\nMIMS 2014");
    content = content.replace(/\s+Ph.D. Student/g, " *name*\nPh.D. Student");

    //remove leading and ending spaces
    clean = content.trim();

    //split at new lines and place in array
    contentArray = clean.split('\n');
    //console.log("CONTENT ARRAY: ",contentArray.length);
    //console.log(contentArray);

    //get student images
    //console.log($(".field-field-person-photo img", text))
   

    imageArray = [];
    $(".field-field-person-photo img", text).each(function () {
        var fixedUrl = "http://www.ischool.berkeley.edu/" + this.src.split("/").slice(3).join("/");
        imageArray.push(fixedUrl)
    });
    //console.log("IMAGE ARRAY : ",imageArray.length);
    // console.log(imageArray);


    //format all data in an object where obj[name]=[name,year,[interests,int,int]]
    // count=0;
    imageNum = 0;
    nameFormat = /[a-zA-z]+ [a-zA-z]+/
    for (var i in contentArray) {
        if(contentArray[i].substring) {
            // if(!nameFormat.test(contentArray[i])){console.log(contentArray[i])}
            //create key with student name
            if (contentArray[i].slice(-6) == "*name*") {
                // count+=1;
                name = contentArray[i].replace(' *name*', '');
                students[name] = [name];
                //add image for this student key
                students[name].push(imageArray[imageNum]);
                imageNum += 1;
            }
            // else if (contentArray[i].slice(-8)=='@ischool'){students[name].push(contentArray[i])}
            else if (contentArray[i].slice(0, 4) == 'MIMS') {
                students[name].push(contentArray[i])
            } 
            else if (contentArray[i].slice(0, 4) == 'Ph.D') {
                students[name].push(contentArray[i])
            } 
            else if (contentArray[i].slice(0, 6) == 'Focus:') {
                focus = contentArray[i].replace(/Focus: /, "");
                // students[name].push(focus;//if we want the interests as string
                var studFocus = focus.split(',');
                var studFocus2 = []; //will contain list with no white spaces
                for (var m in studFocus) {
                    if(studFocus[m].substring) {
                        studFocus2.push(studFocus[m].trim())
                    }
                } //get rid of leading /ending spaces
                students[name].push(studFocus2); //if we want the interests in a sub-array
            } else {
                //console.log(">> Items NOT added: ");
                //console.log(contentArray[i])
            } 
        }
    }

    allFocus = [] //list of all focus regardless of student (Phrases)
    for (var stud in students) {
        for (var foc in students[stud][3]) {
            allFocus.push(students[stud][3][foc])
        }
    }

    //match each to dictionary (clean interests)
    //test dict
    // wordsDict={'design':'Design','mobile':'Mobile','interaction':'Design','hci':'Human-Computer Interaction','experience':'Design','ux':'Design','UI':'Design','management':'Management'}
    //real dict
    wordsDict = {
        "design": "Design",
        "interface": "Design",
        "ux": "Design",
        "ui": "Design",
        "ux/ui": "Design",
        "architecture": "Design",
        "usability": "Design",
        "hci": "HCI",
        "interaction": "HCI",
        "human-computer": "HCI",
        "data": "Big Data",
        "analytics": "Big Data",
        "mining": "Big Data",
        "modeling": "Big Data",
        "informatics": "Big Data",
        "research": "User Research",
        "management": "Management",
        "visualization": "Info Viz",
        "ictd": "ICTD",
        "communication": "ICTD",
        "policy": "Policy",
        "regulation": "Policy",
        "cyberlaw": "Policy",
        "law": "Policy",
        "governance": "Policy",
        "government": "Policy",
        "mobile": "Mobile",
        "mobility": "Mobile",
        "entrepreneurship": "Entrepreneurship",
        "innovation": "Entrepreneurship",
        "entrepreneur": "Entrepreneurship",
        "privacy": "Privacy & Security",
        "privacy.": "Privacy & Security",
        "security": "Privacy & Security",
        "business": "Business Solutions",
        "strategy": "Business Solutions",
        "strategies": "Business Solutions",
        "strategic": "Business Solutions",
        "solutions": "Business Solutions",
        "marketing": "Business Solutions",
        "enterprise": "Business Solutions",
        "enterprises": "Business Solutions",
        "consulting": "Business Solutions",
        "cscw": "Business Solutions",
        "cooperative": "Business Solutions",
        "computer-supported": "Business Solutions",
        "organizations": "Business Solutions"
    }
    //loop throught the focus phrases, split each one, check each word against dict then classify the full phrase
    //console.log('>>NOW CLASSIFYING FOCUS: ');
    // phraseCount=0
    for (var i in wordsDict) {
        phraseCountArray[wordsDict[i]] = 0
    }


    for (var focusPhrase in allFocus) {
        
        var currentFocus = allFocus[focusPhrase];
        if(currentFocus.substring) {
            //TEST SECTION ============================can we match phrases using regex instead of splitting all words and looping??
            // focusFormat=/\sdesign\s/   //should match an item in the dictionary
            // if(focusFormat.test(currentFocus)){console.log('Match found!')}
            //END TEST SECTION=========================

            var curFocusArray = currentFocus.toLowerCase().split(" "); //resuts in array of words for that focus
            //console.log('THE CURRENT FOCUS PHRASE IS: ',currentFocus," < which is split to: >",curFocusArray);

            //now loop through current focus and check if any of the words are in the dictionary
            var tempCatArray = {};
            for (var focusWord in curFocusArray) {
                var curWord = curFocusArray[focusWord];
                // console.log('current focus Array..');
                //tell us what category the word belongs to
                if (curWord in wordsDict) {
                    // if wordsDict[curWord] in 
                    var tempCategory = wordsDict[curWord]; //store the category temp
                    //console.log('>> Category of word: ',curWord," - IS -",tempCategory);

                    //make sure category isnt already in the temp array
                    if (tempCategory in tempCatArray) {
                        // console.log(">> CATEGORY: ",tempCategory," EXISTS in tempCatArray... ");
                    } else {
                        tempCatArray[tempCategory] = tempCategory;
                        // console.log(">> CATEGORY: ",tempCategory," PUSHED to tempCatArray.. ",tempCatArray);
                    }
                } else {
                    //console.log('>> word not in dict ..',curWord)
                }
            }

            // focusCategory end result is a list of [focus1: category1, focus2: category2, focus3: category3]  
            for (var x in tempCatArray) {
                // console.log('>> the focus ',currentFocus, ' belongs to category', tempCatArray[x]);
                focusCategory[currentFocus] = tempCatArray[x];
                categoryFocus[tempCatArray[x]] = []; //sets all categories as keys
                phraseCountArray[tempCatArray[x]] += 1;
            }  
        }

    }

    // categoryFocus end result is a list of [category: [focus1,[focus2,focus2]] 
    for (var focus in focusCategory) {
        // console.log("the key is ",focus);// this is the focus 
        curCategory = focusCategory[focus]; // this is the category of that focus
        categoryFocus[curCategory].push(focus); //the focus phrase (value) is appended to the array for category(key)
    }


    for (i in students) {
        studFocCat = [];
        for (foc in students[i][3]) {
            // console.log('category for '+students[i][3][foc]+' <is> '+focusCategory[students[i][3][foc]]);
            focusCat = focusCategory[students[i][3][foc]]
            studFocCat.push(focusCat);
        }
        students[i].push(studFocCat);
    }

    //check how many focus per category 
    // for(var category in categoryFocus){console.log(category," category count is :",categoryFocus[category].length)}
    // console.log('>>The phraseCountArray is (real focus counts):');
    // console.log(phraseCountArray);
    //console.log('>>The focusCategory Obj is :');
    //console.log(focusCategory);
    //console.log('>>The categoryFocus Obj is :');
    //console.log(categoryFocus);
    //console.log('>> Students Obj:')
    //console.log(students);

} //end findCategories()

function render() {
    // Render all student data on page
    for (i in students) {
        $('#result').append('<div class="studBlock"><img src=' + students[i][1] + '></img><ul style="display:inline-block;margin-left: 5px;"><li>Name: ' + students[i][0] + '</li><li>  Degree: ' + students[i][2] + '</li><li>  Focus: ' + students[i][3] + '</li><li> Categories: ' + studFocCat + '</li></ul></div>');
    }
}