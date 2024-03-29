// Searchbar Handler
$(function(){
    var searchField= $('#query');
    var icon = $('#search-btn');

 // Focus Event Handler
    $(searchField).on('focus', function(){
     $(this).animate({
        width:'100%'
        },400);
     $(icon).animate({
        right: '10px'
        },400);
    });

    // Blur Event Handler
    $(searchField).on('blur', function(){
        if(searchField.val() == ''){ 
            $(searchField).animate({
                 width:'45%'
            },400, function(){});
            $(icon).animate({
                right: '360px'
            },400, function(){});
        }
    });

    // Prevents automatic form submission 
    $('#search-form').submit(function(e){
      e.preventDefault();   
        search();
    });
})

function search() {
    // Clear Results
    $('#results').html('');
    $('#buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
    "https://www.googleapis.com/youtube/v3/search", {
        part:'snippet, id',
        q: q,
        type: 'video',
        key: 'AIzaSyCyLzWCMhLkN6g353fB6Vr6FE4TWhsgZpM'},
        function(data){
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            // Log Data
            console.log(data);

            $.each(data.items, function(i, item){
                // Get Output
                var output = getOutput(item);

                // Display Results
                $('#results').append(output);
            });

            var buttons = getButtons(prevPageToken, nextPageToken);

            //Display Buttons
            $('#buttons').append(buttons);
        }
    );
}

// Next Page Function
function nextPage(){
        var token = $('#next-button').data('token');
        var q = $('#next-button').data('query');

        // Clear Results
        $('#results').html('');
        $('#buttons').html('');
    
        // Get Form Input
        q = $('#query').val();
    
        // Run GET Request on API    
        $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part:'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: 'AIzaSyCyLzWCMhLkN6g353fB6Vr6FE4TWhsgZpM'},
            function(data){
                var nextPageToken = data.nextPageToken;
                var prevPageToken = data.prevPageToken;
    
                // Log Data
                console.log(data);
    
                $.each(data.items, function(i, item){
                    // Get Output
                    var output = getOutput(item);
    
                    // Display Results
                    $('#results').append(output);
                });
    
                var buttons = getButtons(prevPageToken, nextPageToken);
    
                //Display Buttons
                $('#buttons').append(buttons);
            }
        );
}

// Previous Page Function
function prevPage(){
    var token = $('#prev-button').data('token');
    var q = $('#prev-button').data('query');

    // Clear Results
    $('#results').html('');
    $('#buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API    
    $.get(
    "https://www.googleapis.com/youtube/v3/search", {
        part:'snippet, id',
        q: q,
        pageToken: token,
        type: 'video',
        key: 'AIzaSyCyLzWCMhLkN6g353fB6Vr6FE4TWhsgZpM'},
        function(data){
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            // Log Data
            console.log(data);

            $.each(data.items, function(i, item){
                // Get Output
                var output = getOutput(item);

                // Display Results
                $('#results').append(output);
            });

            var buttons = getButtons(prevPageToken, nextPageToken);

            //Display Buttons
            $('#buttons').append(buttons);
        }
    );
}

//Build Output
function getOutput(item){
    var videoId = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate= item.snippet.publishedAt;

    // Build Output String
    var output = `
    <li>
    <div class= "list-left"> <img src=${thumb}></div> 
    <div class= "list-right">
    <h3><a data-fancybox data-type="iframe" data-width="1000" data-height="500" data-src="http://www.youtube.com/embed/${videoId}"> ${title}</a></h3>
    <small>By <span class= "cTitle">${channelTitle}</span> on ${videoDate}</small> <p>${description}</p>
    </li>
    <div class= "clearfix"></div>`;

    return output;
}

//Build the buttons
function getButtons(prevPageToken, nextPageToken){

    if(!prevPageToken){
        var btnoutput = `
        <div class = "button-container">
        <button id= "next-button" class="paging-button" data-token=${nextPageToken} data-query=${q}
        onclick="nextPage();">Next Page</button></div>`;    
    } else {
        var btnoutput = `
        <div class = "button-container"> 
            <button id= "prev-button" class="paging-button" data-token=${prevPageToken} data-query=${q}
            onclick="prevPage();">Previous Page</button></div>
            <button id= "next-button" class="paging-button" data-token=${nextPageToken} data-query=${q}
            onclick="nextPage();">Next Page</button>
        </div>`
    }
        return btnoutput;
}