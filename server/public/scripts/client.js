console.log('JS');

$(readyNow);

function readyNow() {
    console.log('JQ');
    // initial display
    displayList();

}

// function to render to the DOM
function render(todo) {
    let el = $('#dueTodayBody');
    el.empty();
    for(item of todo) {
        let inputText = `
            <tr>
                <td>${item.task}</td>
                <td>${item.priority}</td>
                <td>${item.due_date}</td>
                <td><button id="markCompletedBtn">Mark Completed?</button></td>
        `
        el.append(inputText);
    }

    console.log('in render');
}

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