console.log('JS');

$(readyNow);

function readyNow() {
    console.log('JQ');
    // initial display
    displayList();

    // dynamic click listeners
    $('#container').on('click', '.markCompletedBtn', markComplete);

}

// function to mark a task complete and re-render the DOM
function markComplete() {
    let id = $(this).closest('tr').data('id')
    console.log('in markComplete with this id: ', id);
    // send PUT request
    $.ajax({
        method: 'PUT',
        url: `/todo/${id}`,
        data: {}
    }).then(function (response) {
        console.log(response);
        displayList();
    })
}

// function to render to the DOM
function render(resultsObject) {
    // render Due Today table
    let elToday = $('#dueTodayBody');
    let elSoon = $('#dueSoonBody');
    let elComplete = $('#completedBody');
    elToday.empty();
    for(item of resultsObject.today) {
        //convert date to easier to read
        let newDate = item.due_date.split('T')[0]

        let inputText = `
            <tr data-id="${item.id}">
                <td>${item.task}</td>
                <td>${item.priority}</td>
                <td>${newDate}</td>
                <td><button class="markCompletedBtn">Mark Completed?</button></td>
        `
        elToday.append(inputText);
    }

    // render Due Soon
    elSoon.empty();
    for(item of resultsObject.soon) {
        // convert date to easier to read
        let newDate = item.due_date.split('T')[0]
        
        let inputText = `
            <tr data-id="${item.id}">
                <td>${item.task}</td>
                <td>${item.priority}</td>
                <td>${newDate}</td>
                <td><button class="markCompletedBtn">Mark Completed?</button></td>
        `
        elSoon.append(inputText);
    }

    // render completed
    elComplete.empty();
    for(item of resultsObject.completed) {
        // convert date to easier to read
        let newDate = item.due_date.split('T')[0]

        let inputText = `
            <tr data-id="${item.id}">
                <td>${item.task}</td>
                <td>${item.priority}</td>
                <td>${newDate}</td>
                <td>Completed</td>
        `
        elComplete.append(inputText);
    }
}
//     console.log('in render');
// }

//Function to trigger a GET request for table data
function displayList() {
    console.log('in display');
    
    $.ajax({
        method: 'GET',
        url: '/todo'
    }).then((res) => {
        console.log('response from server: ', res);
        render(res);
    }).catch((err) => {
        console.log('Error in retrieving from DB', err);
        res.sendStatus(500);
    })
}