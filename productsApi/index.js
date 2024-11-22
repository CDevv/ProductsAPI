let children = []
let formHidden = true

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

document.addEventListener('DOMContentLoaded', async () => {
    const formButton = document.getElementById('submit-form-btn')
    const form = document.getElementById('submit-form')

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
    
    loadData()
})