// event handlers

document.getElementById('inputBtn1').addEventListener('click', function () {
    searchProductById(document.getElementById('input1').value);
});

document.getElementById('inputBtn2').addEventListener('click', function () {
    searchProductsByType(document.getElementById('input2').value);
});

document.getElementById('inputBtn3').addEventListener('click', function () {
    searchProductsByPrice(document.getElementById('input3').value);
});

api.searchAllProducts().then(function (value) {
    updateTable('mainTable', value);
});

// function definition

function searchProductById(searchId) {
    api.searchProductById(searchId).then(function (val) {
        return Promise.all([api.searchProductsByPrice(val.price, 50), api.searchProductsByType(val.type), val]);
    }).then(function (val) {
        var similarArray = getIntersection(val[0], val[1], val[2].id);
        updateExaminedText(val[2]);
        updateTable('similarTable', similarArray);
    }).catch(function (val) {
        alert(val);
    });
}

function searchProductsByType(type) {
    api.searchProductsByType(type).then(function (val) {
        updateTable('similarTable', val);
    }).catch(function (val) {
        alert(val);
    })
}

function searchProductsByPrice(price) {
    api.searchProductsByPrice(price, 50).then(function (val) {
        updateTable('similarTable', val);
    }).catch(function (val) {
        alert(val);
    })
}

function getIntersection(arrA, arrB, searchedId) {

    var samePrice = arrA;
    var sameType = arrB;
    var similarArray = [];
    samePrice.forEach(function (obj1) {
        sameType.forEach(function (obj2) {
            if (obj1.id === obj2.id && obj1.id !== searchedId)
                similarArray.push(obj1);
        });
    });

    return similarArray;

}

function updateExaminedText(product) {
    var outputString = "Product Id: " + product.id;
    outputString += "<br> Price: " + product.price;
    outputString += "<br> Type: " + product.type;
    document.getElementById("productText").innerHTML = outputString;
}

function createTableHeader(tableId) {
    var tableHeaderRow = document.createElement('TR');
    var th1 = document.createElement('TH');
    var th2 = document.createElement('TH');
    var th3 = document.createElement('TH');
    var th4 = document.createElement('TH');
    th1.appendChild(document.createTextNode("ProductId"));
    th2.appendChild(document.createTextNode("Type"));
    th3.appendChild(document.createTextNode("Price"));
    th4.appendChild(document.createTextNode("Examine"));
    tableHeaderRow.appendChild(th1);
    tableHeaderRow.appendChild(th2);
    tableHeaderRow.appendChild(th3);
    tableHeaderRow.appendChild(th4);
    document.getElementById(tableId).appendChild(tableHeaderRow);
}

function updateTable(tableId, productArray) {
    var tableBody = document.getElementById(tableId);
    //reset table
    while (tableBody.hasChildNodes()) {
        tableBody.removeChild(tableBody.firstChild);
    }
    //create table header
    createTableHeader(tableId);

    //populate table rows
    for (i = 0; i < productArray.length; i++) {
        var tr = document.createElement('TR');
        var td1 = document.createElement('TD');
        var td2 = document.createElement('TD');
        var td3 = document.createElement('TD');
        var td4 = document.createElement('button');

        td4.addEventListener('click', function () {
            searchProductById(this.parentNode.firstChild.innerHTML);
        });

        td1.appendChild(document.createTextNode(productArray[i].id));
        td2.appendChild(document.createTextNode(productArray[i].type));
        td3.appendChild(document.createTextNode(productArray[i].price));
        td4.appendChild(document.createTextNode("Examine"));
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);


        tableBody.appendChild(tr);
    }

}