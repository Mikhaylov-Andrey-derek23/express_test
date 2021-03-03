document.querySelectorAll('.price').forEach(node =>{
    node.textContent = currentPrice(node.textContent);
})

document.querySelectorAll('.date').forEach(node =>{
    node.textContent = toDate(node.textContent);
})

function currentPrice(element){
    return  new Intl.NumberFormat('ru-RU', {
        currency : 'rub',
        style : 'currency' 
    }).format(element)
    }
function toDate(element){
    return new Intl.DateTimeFormat('eu-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(element))
}

const tableBasket = document.querySelector('.table-basket');



if(tableBasket){
    tableBasket.addEventListener('click', (event)=>{
        if(event.target.classList.contains('js-remove')){
            const id = event.target.dataset.id;
            fetch('/basket/remove/'+id, {method : 'delete'})
            .then(res => res.json())
            .then(basket => {
                if(basket.course.length){
                    let tr = '';
                    basket.course.map(e => {
                        tr =  tr + `<tr>
                            <th>${e.courseID.title}</th>
                            <th>${e.count}</th>
                            <th><span class="price small">${currentPrice(e.courseID.price)}</span></th>
                            <th><button class="btn btn-small js-remove" data-id="${e.courseID._id}">Удалить</button></th>
                        </tr>`;
                    })
                    tableBasket.querySelector('tbody').innerHTML = tr; 
                    document.querySelector('.basket-price').innerHTML = `<h4 class="basket-price">Итого: <span class="price">${currentPrice(basket.price)}</span></h4>`;     
                }else{
                    document.querySelector('.basket').innerHTML ='<p>Корзина пуста</p>';
                }


                
            })
        }
        
    })
}


const instance = M.Tabs.init(document.querySelectorAll('.tabs'));

