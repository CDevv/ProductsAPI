let children = []
let formHidden = true
let editFormContainer = null
let chosenProduct = 0

function clearProductsDOM()
{
    for (const element of children) {
        const container = document.getElementById('container')
        container.removeChild(element)
    }
}

async function loadData()
{
    const res = await fetch('https://localhost:7177/api/Products');
    const products = await res.json()

    console.log(products)

    for (const element of products) {
        addProductDOM(element)
    }
}

function addProductDOM(product)
{
    const container = document.getElementById('container')

    const item = document.createElement('div')
    item.className = 'product'
    item.id = `item-${product.id}`
    container.appendChild(item)

    const title = document.createElement('h1')
    title.innerHTML = product.name
    item.appendChild(title)

    const price = document.createElement('p')
    price.innerHTML = product.price
    item.appendChild(price)

    const delButton = document.createElement('button')
    delButton.innerHTML = "Delete"
    delButton.addEventListener('click', () => deleteProduct(product.id))
    item.appendChild(delButton)

    const editButton = document.createElement('button')
    editButton.innerHTML = "Edit"
    editButton.addEventListener('click', () => showProductEditForm(product.id))
    item.appendChild(editButton)

    children.push(item)
}

async function addProduct(ev, name, price)
{
    ev.preventDefault()

    await fetch('https://localhost:7177/api/Products', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name, price
        })
    }).catch((err) => console.log(err))

    clearProductsDOM()
    loadData()
}

async function deleteProduct(id)
{
    await fetch(`https://localhost:7177/api/Products/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).catch((err) => console.log(err))

    const container = document.getElementById('container')
    const productDOM = document.getElementById(`item-${id}`)
    container.removeChild(productDOM)
}

function showProductEditForm(id)
{
    chosenProduct = id
    const product = document.getElementById(`item-${id}`)
    
    if (editFormContainer.className === '') {
        editFormContainer.className = 'hide'
    }
    else {
        editFormContainer.className = ''
    }

    const formParent = editFormContainer.parentNode
    formParent.removeChild(editFormContainer)

    product.appendChild(editFormContainer)
}

async function editProduct(ev, id, name, price) 
{
    ev.preventDefault()

    await fetch(`https://localhost:7177/api/Products/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id, name, price
        })
    }).catch((err) => console.log(err))

    editFormContainer.className = 'hide'

    clearProductsDOM()
    loadData()
}

document.addEventListener('DOMContentLoaded', async () => {
    const formButton = document.getElementById('submit-form-btn')
    const form = document.getElementById('submit-form')
    editFormContainer = document.getElementById('form-edit')
    const editForm = document.getElementById('submit-form-edit')

    formButton.addEventListener('click', () => {
        formHidden = !formHidden

        if (formHidden) {
            form.className = 'hide'
        }
        else {
            form.className = ''
        }
    })

    form.addEventListener('submit', (ev) => {
        const nameField = document.querySelector('#submit-form input[name="name"]')
        const priceField = document.querySelector('#submit-form input[name="price"]')
        addProduct(ev, nameField.value, priceField.value)
    })

    editForm.addEventListener('submit', (ev) => {
        const nameField = document.querySelector('#submit-form-edit input[name="name"]')
        const priceField = document.querySelector('#submit-form-edit input[name="price"]')
        editProduct(ev, chosenProduct, nameField.value, priceField.value)
    })
    
    loadData()
})