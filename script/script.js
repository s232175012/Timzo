const WHATSAPP_NUMBER = "PLACEHOLDER_TIMZO_WHATSAPP"; // e.g. 277...

let shoes = [
  {id:1, name:"Nike", price:1100, image:"images/airf.jpg", sizes:{6:3,7:5,8:2,9:0,10:4}},
  {id:2, name:"Adidas", price:1100, image:"images/adidas.jpg", sizes:{6:2,7:1,8:5,9:3,10:2}},
  {id:3, name:"Jordan", price:1100, image:"images/jolda.jpg", sizes:{6:4,7:4,8:4,9:4,10:1}},
  {id:4, name:"Puma", price:1100, image:"images/puma.jpg", sizes:{6:5,7:0,8:2,9:2,10:3}},
  {id:5, name:"Timberland", price:1800, image:"images/timba.jpg", sizes:{6:5,7:0,8:2,9:2,10:3}},
];

let cart=[]; let selectedShoe=null;

function render(){
  const c=document.getElementById('products'); c.innerHTML="";
  shoes.forEach(s=>{
    const totalStock = Object.values(s.sizes).reduce((a,b)=>a+b,0);
    c.innerHTML+=`
      <div class="card">
        <img src="${s.image}">
        <h4>${s.name}</h4>
        <div class="price">R${s.price}</div>
        <span class="stock">● ${totalStock} left total</span><br>
        <button class="btn" ${totalStock==0?'disabled':''} onclick="openShoe(${s.id})">View Sizes</button>
      </div>`;
  });
  document.getElementById('cartCount').innerText=cart.reduce((a,b)=>a+b.qty,0);
}

function openShoe(id){
  selectedShoe=shoes.find(x=>x.id==id);
  document.getElementById('mImage').src=selectedShoe.image;
  document.getElementById('mName').innerText=selectedShoe.name;
  document.getElementById('mPrice').innerText=`R${selectedShoe.price}`;
  
  const sizeSel=document.getElementById('mSize'); sizeSel.innerHTML="";
  for(let size in selectedShoe.sizes){
    const left=selectedShoe.sizes[size];
    sizeSel.innerHTML+=`<option value="${size}" ${left==0?'disabled':''}>Size ${size} - ${left} left ${left==0?'(OUT)':''}</option>`;
  }
  document.getElementById('mStockInfo').innerText=`Total: ${Object.values(selectedShoe.sizes).reduce((a,b)=>a+b,0)} pairs left`;
  document.getElementById('productModal').classList.remove('hidden');
}

function addToCart(){
  const size=document.getElementById('mSize').value;
  const qty=parseInt(document.getElementById('mQty').value);
  const left=selectedShoe.sizes[size];
  if(qty>left){document.getElementById('mError').innerText=`Only ${left} left in size ${size}`;return}
  
  cart.push({id:selectedShoe.id, name:selectedShoe.name, size, qty, price:selectedShoe.price});
  closeModal('productModal'); render(); openCart();
}

function openCart(){
  if(cart.length==0){alert("Cart empty");return}
  let html=""; let total=0;
  cart.forEach((c,i)=>{
    total+=c.price*c.qty;
    html+=`<div class="cart-item"><span>${c.name} - Size ${c.size} x${c.qty}</span><span>R${c.price*c.qty} <a href="#" onclick="remove(${i});return false" style="color:red">x</a></span></div>`;
  });
  document.getElementById('cartItems').innerHTML=html;
  document.getElementById('cartTotal').innerHTML=`<strong>Total: R${total}</strong>`;
  document.getElementById('cartModal').classList.remove('hidden');
}
function remove(i){cart.splice(i,1);render(); if(cart.length==0)closeModal('cartModal'); else openCart();}
function closeModal(id){document.getElementById(id).classList.add('hidden'); document.getElementById('mError').innerText="";}

function submitOrder(e){
  e.preventDefault();
  const name=document.getElementById('custName').value;
  const phone=document.getElementById('custPhone').value;
  const campus=document.getElementById('custCampus').value;
  const addr=document.getElementById('custAddress').value;

  let list=""; let total=0;
  cart.forEach(c=>{
    shoes.find(s=>s.id==c.id).sizes[c.size]-=c.qty;
    list+=`• ${c.name} - Size ${c.size} x${c.qty} = R${c.price*c.qty}\n`;
    total+=c.price*c.qty;
  });

  const msg=`🔥 NEW ORDER - TIMZO COLLECTION 🔥\n\n${list}\nTotal: R${total}\n\nCustomer:\nName: ${name}\nPhone: ${phone}\nDelivery: ${campus}\nAddress: ${addr}\n\nStock after order:\n${shoes.map(s=>`${s.name}: ${Object.entries(s.sizes).map(([sz,stk])=>`Size ${sz}:${stk}`).join(', ')}`).join('\n')}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
  cart=[]; render(); closeModal('cartModal'); e.target.reset();
}

render();