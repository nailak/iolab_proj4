// when user stops typing name in the seach box, submit the form (no button needed)
var timer;
$('#studName').on('keyup', function(){
        var form = this;
        if($(form).val() != ""){
            clearTimeout(timer);
            timer = setTimeout(function() { $(form).submit(); }, 600 );
        }
    })

//or if user checks a box, submit the form 
$(".checkbox_filters").click(function() {
	$('#filters').submit();
});

//SUBMIT FUNCTION#
//################
//when filter form is submitted.. run some queries then append results 
//Add queries here..

$('#filters').on('submit', function(e) {
        
        e.preventDefault();
        // student name that we want to search for
        var searchName = $('#studName').val();
        
        //student degree that we want to search for
        var box1=$('input:checkbox[name=MIMS14]:checked').val();
        var box2=$('input:checkbox[name=MIMS13]:checked').val();
        var box3=$('input:checkbox[name=PHD]:checked').val();
        console.log('form submit: user entered search term:', searchName);
        console.log('form submit: user selected degrees:',box1,box2,box3);

        //clear old filter results
        $('#filter_results').children().remove()
        $('#error').remove();


		//if statement goes here
			//no data found .. display error message
			// $('#error').show();

			//else append results to the sidebar (this is dummy data)
			$('#filter_results').append('<ul><li>'+searchName+'</li><li>'+box1+box2+box3+'</li><li>Focuses here</li></ul>');

    });



