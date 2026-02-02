// emailjs init
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('YOUR_PUBLIC_KEY'); // put ur key
    }
})();

// cart stuff
var cart = [];
var total = 0;

// add to cart fn
function addToCart(id, nm, prc) {
    // chk if alredy there
    var found = cart.find(function (x) {
        return x.id === id;
    });

    if (found) {
        // increse qty if exist
        found.qty = found.qty + 1;
        showCart();
        return;
    }

    // new item push
    cart.push({
        id: id,
        nm: nm,
        prc: prc,
        qty: 1
    });

    showCart();
    swapBtns(id, true);
    hideCartErr();
}

// remove fn
function removeFromCart(id) {
    cart = cart.filter(function (x) {
        return x.id !== id;
    });

    showCart();
    swapBtns(id, false);
}

// plus qty
function increaseQty(id) {
    var itm = cart.find(function (x) {
        return x.id === id;
    });

    if (itm) {
        itm.qty = itm.qty + 1;
        showCart();
    }
}

// minus qty
function decreaseQty(id) {
    var itm = cart.find(function (x) {
        return x.id === id;
    });

    if (itm) {
        if (itm.qty > 1) {
            itm.qty = itm.qty - 1;
            showCart();
        } else {
            // qty 1 so remove
            removeFromCart(id);
        }
    }
}

// swap add/remove btns
function swapBtns(id, added) {
    var item = document.querySelector('.singleitem[data-id="' + id + '"]');
    if (!item) return;

    var addB = item.querySelector('.addbtn');
    var remB = item.querySelector('.removebtn');

    if (added) {
        addB.classList.add('hidden');
        remB.classList.remove('hidden');
    } else {
        addB.classList.remove('hidden');
        remB.classList.add('hidden');
    }
}

// update cart display
function showCart() {
    var box = document.getElementById('cartItems');
    var totEl = document.getElementById('totalAmount');

    // clear
    box.innerHTML = '';

    // calc total
    total = 0;
    for (var i = 0; i < cart.length; i++) {
        total = total + (cart[i].prc * cart[i].qty);
    }

    // show items or empty msg
    if (cart.length === 0) {
        var emptyD = document.createElement('div');
        emptyD.className = 'emptymsg';
        emptyD.id = 'emptyCartMessage';
        emptyD.innerHTML = '<span class="emptyicon">🛒</span><p>cart is emty</p>';
        box.appendChild(emptyD);
    } else {
        for (var j = 0; j < cart.length; j++) {
            var c = cart[j];
            var itemTot = c.prc * c.qty;
            var row = document.createElement('div');
            row.className = 'cartrow';
            row.innerHTML = '<span>' + (j + 1) + '</span>' +
                '<span>' + c.nm + '</span>' +
                '<span class="qtybox">' +
                '<button class="qtybtn minusbtn" onclick="decreaseQty(' + c.id + ')">-</button>' +
                '<span class="qtynum">' + c.qty + '</span>' +
                '<button class="qtybtn plusbtn" onclick="increaseQty(' + c.id + ')">+</button>' +
                '</span>' +
                '<span>₹' + itemTot + '</span>';
            box.appendChild(row);
        }
    }

    // update total
    totEl.textContent = '₹' + total;
}

// scroll fn
function scrollToServices() {
    var sec = document.getElementById('ourservices');
    if (sec) {
        sec.scrollIntoView({ behavior: 'smooth' });
    }
}

// form submit
document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var nm = document.getElementById('fullName').value;
    var em = document.getElementById('email').value;
    var ph = document.getElementById('phone').value;

    // check feilds
    if (!nm || !em || !ph) {
        showFormErr();
        return;
    }

    if (cart.length === 0) {
        showCartErr();
        hideFormErr();
        return;
    }

    hideCartErr();
    hideFormErr();

    // make services list for email
    var svcList = '';
    for (var i = 0; i < cart.length; i++) {
        svcList += cart[i].nm + ' x' + cart[i].qty + ' - ₹' + (cart[i].prc * cart[i].qty);
        if (i < cart.length - 1) {
            svcList += '\n';
        }
    }

    // email params
    var prms = {
        to_email: em,
        from_name: nm,
        customer_name: nm,
        customer_email: em,
        customer_phone: ph,
        services: svcList,
        total_amount: '₹' + total,
        order_date: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    // send mail
    if (typeof emailjs !== 'undefined') {
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', prms)
            .then(function (res) {
                console.log('sent!', res.status);
                showSucces();
                resetAll();
            })
            .catch(function (err) {
                console.log('err:', err);
                showSucces();
                resetAll();
            });
    } else {
        console.log('emailjs not available');
        showSucces();
        resetAll();
    }
});

// show success
function showSucces() {
    var m = document.getElementById('successMessage');
    if (m) {
        m.classList.remove('hidden');
        setTimeout(function () {
            m.classList.add('hidden');
        }, 5000);
    }
}

// cart err
function showCartErr() {
    var e = document.getElementById('cartErrorMessage');
    if (e) e.classList.remove('hidden');
}

function hideCartErr() {
    var e = document.getElementById('cartErrorMessage');
    if (e) e.classList.add('hidden');
}

// form err
function showFormErr() {
    var e = document.getElementById('formErrorMessage');
    if (e) e.classList.remove('hidden');
}

function hideFormErr() {
    var e = document.getElementById('formErrorMessage');
    if (e) e.classList.add('hidden');
}

// reset
function resetAll() {
    document.getElementById('fullName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';

    cart = [];
    showCart();

    // reset btns
    var items = document.querySelectorAll('.singleitem');
    for (var i = 0; i < items.length; i++) {
        var a = items[i].querySelector('.addbtn');
        var r = items[i].querySelector('.removebtn');
        a.classList.remove('hidden');
        r.classList.add('hidden');
    }
}

// newsletter
function subscribeNewsletter() {
    var n = document.getElementById('newsletterName').value;
    var e = document.getElementById('newsletterEmail').value;
    var msg = document.getElementById('newsletterSuccess');

    if (!n || !e) {
        alert('plz enter name n email');
        return;
    }

    // basic email chk
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(e)) {
        alert('enter valid email plz');
        return;
    }

    console.log('subscribed:', n, e);

    if (msg) {
        msg.classList.remove('hidden');
        setTimeout(function () {
            msg.classList.add('hidden');
        }, 4000);
    }

    document.getElementById('newsletterName').value = '';
    document.getElementById('newsletterEmail').value = '';
}

// smooth scroll
var links = document.querySelectorAll('a[href^="#"]');
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (e) {
        e.preventDefault();
        var href = this.getAttribute('href');
        var tgt = document.querySelector(href);
        if (tgt) {
            tgt.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// onload
document.addEventListener('DOMContentLoaded', function () {
    showCart();
    console.log('ready');
});
