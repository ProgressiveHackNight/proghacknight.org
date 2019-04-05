setUp();

function setUp() {
    setupEventbriteWidget();
}

function setupEventbriteWidget() {
    var eventbriteApiUrl = "https://www.eventbriteapi.com/v3/users/me/events/?order_by=start_asc&time_filter=current_future&token=YTASI7ZOOPL5NMKZHQAS";

    // Use EventBrite API to get a list of our events and choose the latest one
    $.when( $.getJSON( eventbriteApiUrl ) ).then(function(data, textStatus, jqXHR ) {
        reducer = function(newestEvent, currentEvent) {
            return newestEvent.created > currentEvent.created ? newestEvent : currentEvent;
        };
        var newestEvent = data.events.reduce(reducer);
        buildEvent(newestEvent);
    });
}

function buildEvent(newestEvent) {
    addTitleToPage(newestEvent.name.text, newestEvent.url);
    addDescriptionToPage(newestEvent.summary, newestEvent.description.html);
    addEventDate(newestEvent.start.local);
    window.EBWidgets.createWidget({
        widgetType: 'checkout',
        eventId: newestEvent.id,
        modal: true,
        modalTriggerElementId: 'eventbrite-widget-modal-trigger'
    });
}

function addTitleToPage(title, urlToEvent) {
    $('#eventbrite-event-title').append('<a href="'+urlToEvent+'">' + title + '</a>');
}

function addEventDate(date) {
    var d = new Date(date);
    $('#eventbrite-event-date').append('<p>' + (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear() + '</p>');
}

function addDescriptionToPage(summary, desc) {
    $('#eventbrite-event-summary').append(summary + '...');
    $('#eventbrite-event-desc').append(desc);
    $("#read-more").click(function() {
        var elem = $("#read-more").text();
        if (elem == "Read More") {
            //Stuff to do when btn is in the read more state
            $("#read-more").text("Read Less");
            $("#eventbrite-event-summary").hide();
            $("#eventbrite-event-desc").slideDown();
        } else {
            //Stuff to do when btn is in the read less state
            $("#read-more").text("Read More");
          $("#eventbrite-event-desc").slideUp();
            $("#eventbrite-event-summary").show();
        }
    });
}