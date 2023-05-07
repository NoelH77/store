
function cart(db, printProducts) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    // let cantidadCarro = 0
    let indicesCarro = []
    // ELEMENTOS DEL DOM
    const productsDOM = document.querySelector('.products__container')
    const notifyDOM = document.querySelector('.notify')
    const cartDOM = document.querySelector('.cart__body')
    const countDOM = document.querySelector('.cart__count--item')
    const totalDOM = document.querySelector('.cart__total--item')
    const checkoutDOM = document.querySelector('.btn--buy')
    const addIvaDOM = document.querySelector('.cart__total--item--iva')
    const precioTotalDOM = document.querySelector('.cart__total--item--total')

    function printCart () {
        let htmlCart = ''

        if (cart.length === 0) {
            htmlCart += `
            <div class="cart__empty">
                <i class="bx bx-cart" ></i>
                <p class="cart__empty--text">No hay productos en el carrito</p>
            </div>
            `
            notifyDOM.classList.remove('show--notify')
        } else {
            for (const item of cart){
                const product = db.find(p => p.id === item.id)
                htmlCart += `
                <article class="article">
                    <div class="article__image">
                        <img src="${product.image}" alt="${product.name}" />
                    </div>
                    <div class="article__content">
                    <h3 class="article__title">${product.name}</h3>
                    <span class="article__price">$${product.price}</span>
                    <div class="article__quantity">
                        <button type="button" class="article__quantity-btn article--minus" data-id="${item.id}">
                            <i class="bx bx-minus"></i>
                        </button>
                        <span class="article__quantity-text">${item.qty}</span>
                        <button type="button" class="article__quantity-btn article--plus" data-id="${item.id}">
                            <i class="bx bx-plus"></i>
                        </button>
                    </div>
                    <button type="button" class="article__btn remove-from-cart" data-id="${item.id}">
                        <i class="bx bx-trash" ></i>
                    </button>
                    </div>
                    </article>
                `
            }
            notifyDOM.classList.add('show--notify')
        }
        
        cartDOM.innerHTML = htmlCart
        notifyDOM.innerHTML = showItemsCount()
        countDOM.innerHTML = showItemsCount()
        totalDOM.innerHTML = '$' + showTotal().toFixed(2)
        addIvaDOM.innerHTML = '$' + addIva(showTotal()).toFixed(2)
        precioTotalDOM.innerHTML = '$' + precioTotal(addIva(showTotal()),showTotal()).toFixed(2)
        localStorage.setItem('cart',JSON.stringify(cart))
        
    }

    function addToCart (id, qty = 1) { 
            const product = db.find(i => i.id === id)

            if (product.quantity >= qty) {  

                const itemFinded = cart.find(i => i.id === id)

                if (itemFinded){
                    itemFinded.qty += qty
                    const conteoIndices = indicesCarro.find(i => i.id === id)
                    if(conteoIndices){
                        conteoIndices.qty += qty
                    }


                } else {
                    cart.push({ id, qty })
                    indicesCarro.push({ id, qty })
                }

                product.quantity -= qty
                
                printCart()
               printProducts()
            //    cantidadCarro += 1
            } 
            
            else {
                window.alert("Lo sentimos, no hay suficiente stock disponible para agregar este producto al carrito")
            }
        
    }

    function removeFromCart(id, qty = 1) {
        const product = db.find(i => i.id === id)
        const itemFinded = cart.find(i => i.id === id)
        const result = itemFinded.qty - qty
        if (result > 0) {
            itemFinded.qty -= qty
            product.quantity += qty
            // cantidadCarro -= 1

                const conteoIndices = indicesCarro.find(i => i.id === id)
                if(conteoIndices){
                    conteoIndices.qty -= qty
                }

        } else {
            cart = cart.filter(i => i.id !== id)
            product.quantity += qty
            // cantidadCarro -= 1

            const conteoIndices = indicesCarro.find(i => i.id === id)
                if(conteoIndices){
                    conteoIndices.qty -= qty
                }
        }
        printCart()
        printProducts()
    }

    function deleteFromCart (id) {

        const product = db.find(i => i.id === id)
        const conteoIndices = indicesCarro.find(i => i.id === id)
        // product.quantity += cantidadCarro
        if(product.id === conteoIndices.id){
            product.quantity += conteoIndices.qty   
        }
               
        indicesCarro = indicesCarro.filter(i => i.id !== id)
        cart = cart.filter(i => i.id !== id)
        

        printCart()
        printProducts()
        // cantidadCarro = 0
    }

    function showItemsCount () {
        let suma = 0
        for (const item of cart) {
            suma += item.qty
        }
        return suma
    }

    function showTotal () {
        let total = 0
        for (const item of cart) {
            const productFinded = db.find(p => p.id === item.id)
            total += item.qty * productFinded.price
        }
        return total
    }

    function addIva(e) {
        let iva = e * .16
        return iva
    }

    function precioTotal(i,p) {
        let total = i + p
        return total
    }

    function checkout () {
        
        cart = []
        printCart()
        printProducts()
        window.alert('Gracias por su compra')
    }

    printCart() 
    // EVENTOS
    productsDOM.addEventListener('click', function (e) {
        if (e.target.closest('.add--to--cart')){
            const id = +e.target.closest('.add--to--cart').dataset.id
            addToCart(id)
        }
    })

    cartDOM.addEventListener('click', function (e) {
        if (e.target.closest('.article--minus')) {
            const id = +e.target.closest('.article--minus').dataset.id
            removeFromCart(id)
            
        }
        if (e.target.closest('.article--plus')) {
            const id = +e.target.closest('.article--plus').dataset.id
            addToCart(id)
            
        }
        if (e.target.closest('.remove-from-cart')) {
            const id = +e.target.closest('.remove-from-cart').dataset.id
            deleteFromCart(id)
            
        }
    })

    checkoutDOM.addEventListener('click', function (){
        checkout()
        
    })

}


export default cart