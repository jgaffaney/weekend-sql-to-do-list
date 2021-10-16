console.log('JS');

$(readyNow);

function readyNow() {
    console.log('JQ');
    // initial display
    displayList();

    // click listeners
    $('#addTaskBtn').on('click', removeClass)


    // dynamic click listeners
    $('#container').on('click', '.markCompletedBtn', markComplete);
    $('#container').on('click', '#submitBtn', addNewTask)

}

function addNewTask() {
    console.log('submit clicked');
    let newTask = {
        task: $('#taskIn').val(),
        due_date: $('#dueDateIn').val(),
        priority: $('#priorityIn').val()
    }
    console.log('this is new task: ', newTask);
    
    // clear the inputs
    $('#addTaskContainer').children().val('');
    // ajax call to server
    $.ajax({
        method: 'POST',
        url: "/todo",
        data: newTask
    }).then(function(response) {
        console.log('POST response from server: ', response);
        displayList()
    }).catch(function(error) {
        console.log('Error on POST: ', error);
        alert('Error posting new task')
    })
}

// a function to remove a class
function removeClass() {
    $(this).siblings('div').removeClass('hidden');
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
                <td><button class="markCompletedBtn">Mark Completed</button></td>
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
                <td><button class="markCompletedBtn">Mark Completed</button></td>
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
        console.log('Error in retrieving from server', err);
        res.sendStatus(500);
    })
}