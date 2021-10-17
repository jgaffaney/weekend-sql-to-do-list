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
    $('#container').on('click', ".deleteBtn", deleteTask)

}

function deleteTask() {
    console.log('Delete Button clicked');
    let id = $(this).closest('tr').data('id');
    swal({
        title: 'Are you sure you want to Delete?',
        text: 'This will permanently remove the task from you list and cannot be undone',
        icon: 'warning',
        buttons: true,
        dangerMode: true
        }).then(function(willDelete) {
            if(willDelete) {
                $.ajax({
                    method: 'DELETE',
                    url: `/todo/${id}`,
                    Data: {}
                }).then(function(response) {
                    console.log(response);
                    swal('Your task has been deleted', {icon: "success"})
                }).catch(function(err) {
                    swal('Error in deleting task')
                })
        } else {
            swal('Your task has not been deleted!')
        }
        })
}

function addNewTask() {
    if(!$('#dueDateIn').val()) {
        swal('Oops!', 'Due Date cannot be blank')
    } else {
        $(this).closest('div').addClass('hidden');
        console.log('submit clicked');
        let newTask = {
            task: $('#taskIn').val(),
            due_date: $('#dueDateIn').val(),
            priority: $('#priorityIn').val()
        }
        console.log('this is new task: ', newTask);
        
        // clear the inputs and hide them
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
            swal('Error posting new task')
        })
    }
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
    }).catch(function(err) {
        console.log(err);
        swal('Error in Marking your task complete')
    })
}

// function to render to the DOM
function render(resultsObject) {
    let compDate = new Date();
    // render Due Today table
    let elToday = $('#dueTodayBody');
    let elSoon = $('#dueSoonBody');
    let elComplete = $('#completedBody');
    elToday.empty();
    for(item of resultsObject.today) {
        //convert date to easier to read
        let newDate = item.due_date.split('T')[0]
        let today = new Date(compDate).toISOString().split('T')[0]
        console.log('today: ', today);
        
        // let now = today.split('T')[0];
        // console.log('campareDate', compareDate);
        
        if(!item.priority) {
            item.priority = '';
        }
        let inputText = $(`
            <tr data-id="${item.id}">
                <td>${item.task}</td>
                <td>${item.priority}</td>
                <td>${newDate}</td>
                <td><button class="btn btn-sm btn-outline-primary markCompletedBtn">Mark Completed</button></td>
                <td><button class="btn btn-sm btn-outline-danger deleteBtn">Delete</button></td>
        `)
        console.log('this is newDate in render: ', newDate);
        console.log('this is today in render: ', today);
        // console.log('this is the conditional: ', compareDate.getDate() < today.getDate());
        
        
        console.log('conditional: ', newDate<today);
        
        if(newDate < today) {
            console.log('this: ', $(this).closest('tr'));
            
            inputText.addClass('overdue');
        }
        elToday.append(inputText);
    }

    // render Due Soon
    elSoon.empty();
    for(item of resultsObject.soon) {
        // convert date to easier to read
        let newDate = item.due_date.split('T')[0]
        if(!item.priority) {
            item.priority = '';
        }
        let inputText = `
            <tr data-id="${item.id}">
                <td>${item.task}</td>
                <td>${item.priority}</td>
                <td>${newDate}</td>
                <td><button class="btn btn-sm btn-outline-primary markCompletedBtn">Mark Completed</button></td>
                <td><button class="btn btn-sm btn-outline-danger deleteBtn">Delete</button></td>
        `
        elSoon.append(inputText);
    }

    // render completed
    elComplete.empty();
    for(item of resultsObject.completed) {
        // convert date to easier to read
        let newDate = item.due_date.split('T')[0]
        if(!item.priority) {
            item.priority = '';
        }
        let inputText = `
            <tr data-id="${item.id}">
                <td>${item.task}</td>
                <td>${item.priority}</td>
                <td>${newDate}</td>
                <td>Completed</td>
                <td><button class="btn btn-sm btn-outline-danger deleteBtn">Delete</button></td>
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
        swal('Error retrieving data from Database')
    })
}