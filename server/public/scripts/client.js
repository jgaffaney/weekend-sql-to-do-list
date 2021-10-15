console.log('JS');

$(readyNow);

function readyNow() {
    console.log('JQ');
    $('#displayList').on('click', displayList)
}

function render() {
    console.log('in render');
}

function displayList() {
    console.log('in display');
    
    $.ajax({
        method: 'GET',
        url: '/todo'
    }).then((req, res) => {
        console.log('response from server: ', res);
        render();
    }).catch((err) => {
        console.log('Error in retrieving from DB', err);
        res.sendStatus(500);
    })
}