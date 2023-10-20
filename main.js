let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let mood = 'create';
let updateIndex ;
// get total

function getTotal() {
    if (price.value != '') {
        let result = ( +price.value + +taxes.value + +ads.value ) - +discount.value;
        total.innerHTML = result
        total.style.backgroundColor = "#040"
    } else {
        total.innerHTML = ""
        total.style.backgroundColor = "#a00c02ce"
    }
}


// create product
let dataProducts ;
if (localStorage.products != null) {
    dataProducts = JSON.parse(localStorage.products)
} else dataProducts = [] ;
submit.onclick = function () {
    let newProduct = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase()
    }
    if (title.value != '' && price.value != '' && category.value != '' && newProduct.count < 100) {
        if (mood === 'create') {
            // count 
            if (newProduct.count > 1) {
                count.style.border = 'none';
                for (var i = 0; i < newProduct.count; i++) {
                    dataProducts.push(newProduct);
                }
                clearData();
            } else if (newProduct.count < 0 ) {
                count.style.border = '1px solid red';
            } else {
                dataProducts.push(newProduct);
                clearData();
            }
        } else {
            dataProducts[updateIndex] = newProduct;
            mood = 'create';
            submit.innerHTML = 'Create New Product';
            count.style.display = 'block' ;
            clearData();
        }
    } 
    // save data in local storage
    localStorage.setItem('products', JSON.stringify(dataProducts))  ;
    
    showData();
}


// clear inputs

function clearData() {
    document.querySelectorAll('.inputs input').forEach( input => input.value = '');
    total.innerHTML = ""
    total.style.backgroundColor = "#a00c02ce"
    count.style.border = 'none';
}

// read data

function showData() {
    getTotal()
    let idNum = 0
    let htmlProducts = '' ;
    htmlProducts += dataProducts.map( product => {
        return `
                <tr>
                    <td>${++idNum}</td>
                    <td>${product.title}</td>
                    <td>${product.price}</td>
                    <td>${product.taxes}</td>
                    <td>${product.ads}</td>
                    <td>${product.discount}</td>
                    <td>${product.total}</td>
                    <td>${product.category}</td>
                    <td><button onclick="updateData(${idNum})" id="update">update</button></td>
                    <td><button onclick="deleteData(${idNum})" id="delete">delete</button></td>
                </tr>
                `
    }).join('')
    
    document.getElementById('tbody').innerHTML = htmlProducts
    let btnDeleteAll = document.getElementById('deleteAll')
    if (dataProducts.length > 0) {
        btnDeleteAll.innerHTML = `<button onclick="deleteAll()" class="deleteAll" >Delete All (${dataProducts.length})</button>`
    } else btnDeleteAll.innerHTML = ''

}
showData() 

// delete data

function deleteData(i) {
    dataProducts.splice(i-1, 1);
    localStorage.setItem('products', JSON.stringify(dataProducts));
    showData();
}

function deleteAll() {
    localStorage.clear();
    dataProducts.splice(0);
    showData();
}

// update data

function updateData(i) {
    title.value = dataProducts[i-1].title;
    price.value = dataProducts[i-1].price;
    taxes.value = dataProducts[i-1].taxes;
    ads.value = dataProducts[i-1].ads;
    discount.value = dataProducts[i-1].discount;
    getTotal();
    count.style.display = 'none';
    category.value = dataProducts[i-1].category;
    submit.innerHTML = 'Update'
    mood = 'update';
    updateIndex = i-1 ;
    scroll({
        top: 0 ,
        behavior: 'smooth'
    })
}
// search data

let searchMood = 'title' ;

function getSearchMood(id) {
    let search = document.getElementById('search');
    if (id == 'searchTitle') {
        searchMood = 'title' ;
        search.placeholder = 'Search By Title' ;
    } else {
        searchMood = 'category' ;
        search.placeholder = 'Search By Category' ;
    }
    search.focus();
    search.value = '' ;
    showData()
}

function searchData(value) {
    let htmlProducts = '' ;
    for (let i = 0; i < dataProducts.length; i++) {
        if (searchMood == 'title') {
            
                if (dataProducts[i].title.includes(value.toLowerCase())) {
                    
                    htmlProducts += `
                                    <tr>
                                        <td>${i+1}</td>
                                        <td>${dataProducts[i].title}</td>
                                        <td>${dataProducts[i].price}</td>
                                        <td>${dataProducts[i].taxes}</td>
                                        <td>${dataProducts[i].ads}</td>
                                        <td>${dataProducts[i].discount}</td>
                                        <td>${dataProducts[i].total}</td>
                                        <td>${dataProducts[i].category}</td>
                                        <td><button onclick="updateData(${i+1})" id="update">update</button></td>
                                        <td><button onclick="deleteData(${i+1})" id="delete">delete</button></td>
                                    </tr>
                                    `
                }
            
        } else {
                if (dataProducts[i].category.includes(value.toLowerCase())) {
                    htmlProducts += `
                                    <tr>
                                        <td>${i+1}</td>
                                        <td>${dataProducts[i].title}</td>
                                        <td>${dataProducts[i].price}</td>
                                        <td>${dataProducts[i].taxes}</td>
                                        <td>${dataProducts[i].ads}</td>
                                        <td>${dataProducts[i].discount}</td>
                                        <td>${dataProducts[i].total}</td>
                                        <td>${dataProducts[i].category}</td>
                                        <td><button onclick="updateData(${i+1})" id="update">update</button></td>
                                        <td><button onclick="deleteData(${i+1})" id="delete">delete</button></td>
                                    </tr>
                                    `
                }
            
        }
    }
    document.getElementById('tbody').innerHTML = htmlProducts
}

// clean data