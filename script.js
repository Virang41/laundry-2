// EmailJS configration - yaha se email bhejta hoon
var EMAILJS_PUBLIC_KEY = 'N9-L_r3_VHoD8Ttf8';
var EMAILJS_SERVICE_ID = 'service_l6enohg';
var EMAILJS_TEMPLATE_ID = 'template_319eu6v';
var OWNER_EMAIL = 'pegepif536@yumobiz.com';

// Email js shuru karo
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('EmailJS initialized')
    } else {
        console.log('EmailJS not loaded');
    }
})();

var cart = [];
var total = 0


function addToCart(id, nm, prc) {
    var found = cart.find(function (x) {
        return x.id === id
    });

    if (found) {
        found.qty = found.qty + 1;
        showCart()
        return;
    }

    cart.push({
        id: id,
        nm: nm,
        prc: prc,
        qty: 1
    });

    showCart();
    swapBtns(id, true)
    hideCartErr();
}


function removeFromCart(id) {
    cart = cart.filter(function (x) {
        return x.id !== id;
    });
    showCart();
    swapBtns(id, false)
}


function increaseQty(id) {
    var itm = cart.find(function (x) {
        return x.id === id;
    });
    if (itm) {
        itm.qty = itm.qty + 1;
        showCart()
    }
}

// quantity kam karo
function decreaseQty(id) {
    var itm = cart.find(function (x) {
        return x.id === id
    });

    if (itm) {
        if (itm.qty > 1) {
            itm.qty = itm.qty - 1
            showCart();
        } else {
            removeFromCart(id)
        }
    }
}


function swapBtns(id, added) {
    var item = document.querySelector('.singleitem[data-id="' + id + '"]');
    if (!item) return

    var addB = item.querySelector('.addbtn');
    var remB = item.querySelector('.removebtn')

    if (added) {
        addB.classList.add('hidden')
        remB.classList.remove('hidden');
    } else {
        addB.classList.remove('hidden');
        remB.classList.add('hidden');
    }
}

// cart dikhao
function showCart() {
    var box = document.getElementById('cartItems');
    var totEl = document.getElementById('totalAmount')

    box.innerHTML = '';

    total = 0;
    for (var i = 0; i < cart.length; i++) {
        total = total + (cart[i].prc * cart[i].qty);
    }


    if (cart.length === 0) {
        var emptyD = document.createElement('div');
        emptyD.className = 'emptymsg'
        emptyD.id = 'emptyCartMessage';
        emptyD.innerHTML = '<span class="emptyicon">🛒</span><p>cart is emty</p>';  // Empty likhna tha emty likh diya
        box.appendChild(emptyD);
    } else {
        for (var j = 0; j < cart.length; j++) {
            var c = cart[j];
            var itemTot = c.prc * c.qty
            var row = document.createElement('div');
            row.className = 'cartrow';
            row.innerHTML = '<span>' + (j + 1) + '</span>' +
                '<span>' + c.nm + '</span>' +
                '<span class="qtybox">' +
                '<button class="qtybtn minusbtn" onclick="decreaseQty(' + c.id + ')">-</button>' +
                '<span class="qtynum">' + c.qty + '</span>' +
                '<button class="qtybtn plusbtn" onclick="increaseQty(' + c.id + ')">+</button>' +
                '</span>' +
                '<span>₹' + itemTot + '</span>'
            box.appendChild(row)
        }
    }

    totEl.textContent = '₹' + total
}

// smooth scroll kar do services pe
function scrollToServices() {
    var sec = document.getElementById('ourservices')
    if (sec) {
        sec.scrollIntoView({ behavior: 'smooth' })
    }
}

// Form submit ka code yaha hai
document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var nm = document.getElementById('fullName').value
    var em = document.getElementById('email').value;
    var ph = document.getElementById('phone').value


    if (!nm || !em || !ph) {
        showFormErr()
        return;
    }

    // cart empty check
    if (cart.length === 0) {
        showCartErr();
        hideFormErr()
        return
    }

    hideCartErr();

    var svcList = ''
    for (var i = 0; i < cart.length; i++) {
        svcList += cart[i].nm + ' x' + cart[i].qty + ' - ₹' + (cart[i].prc * cart[i].qty);
        if (i < cart.length - 1) {
            svcList += '\n'
        }
    }

    // date le lo
    var orderDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })


    var ownerParams = {
        to_email: OWNER_EMAIL,
        reply_to: em,
        from_name: nm,
        customer_name: nm,
        customer_email: em,
        customer_phone: ph,
        services: svcList,
        total_amount: '₹' + total,
        order_date: orderDate,
        message_type: 'New Booking Received!'
    }


    var customerParams = {
        to_email: em,
        reply_to: OWNER_EMAIL,
        from_name: 'WashKaro Laundry',
        customer_name: nm,
        customer_email: em,
        customer_phone: ph,
        services: svcList,
        total_amount: '₹' + total,
        order_date: orderDate,
        message_type: 'Booking Confirmation - Thank You!'
    };

    console.log('Sending emails...')
    console.log('Owner email:', ownerParams)
    console.log('Customer email:', customerParams);

    // Email JS se bhejo
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, ownerParams)
            .then(function (res) {
                console.log('Owner email sent!', res.status)

                return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, customerParams)
            })
            .then(function (res2) {
                console.log('Customer email sent!', res2.status);
                showSucces()
                resetAll();
            })
            .catch(function (err) {
                console.log('Email error:', err)
                alert('Email bhejne me problem hui! Console check karo.');
                showSucces();
                resetAll()
            });
    } else {
        console.log('EmailJS not configured properly')
        showSucces();
        resetAll();
    }
});


function showSucces() {
    var m = document.getElementById('successMessage')
    if (m) {
        m.classList.remove('hidden')
        setTimeout(function () {
            m.classList.add('hidden');
        }, 5000)
    }
}


function showCartErr() {
    var e = document.getElementById('cartErrorMessage');
    if (e) e.classList.remove('hidden')
}


function hideCartErr() {
    var e = document.getElementById('cartErrorMessage')
    if (e) e.classList.add('hidden');
}


function showFormErr() {
    var e = document.getElementById('formErrorMessage')
    if (e) e.classList.remove('hidden');
}

// form error hatao
function hideFormErr() {
    var e = document.getElementById('formErrorMessage');
    if (e) e.classList.add('hidden')
}


function resetAll() {
    document.getElementById('fullName').value = ''
    document.getElementById('email').value = '';
    document.getElementById('phone').value = ''

    cart = [];
    showCart()

    var items = document.querySelectorAll('.singleitem')
    for (var i = 0; i < items.length; i++) {
        var a = items[i].querySelector('.addbtn')
        var r = items[i].querySelector('.removebtn');
        a.classList.remove('hidden')
        r.classList.add('hidden');
    }
}

// newsletter ka function
function subscribeNewsletter() {
    var n = document.getElementById('newsletterName').value
    var e = document.getElementById('newsletterEmail').value;
    var msg = document.getElementById('newsletterSuccess')

    if (!n || !e) {
        alert('plz enter name n email')
        return;
    }


    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(e)) {
        alert('enter valid email plz');  //lz
        return
    }

    console.log('subscribed:', n, e)

    if (msg) {
        msg.classList.remove('hidden')
        setTimeout(function () {
            msg.classList.add('hidden');
        }, 4000)
    }

    document.getElementById('newsletterName').value = ''
    document.getElementById('newsletterEmail').value = '';
}


var links = document.querySelectorAll('a[href^="#"]')
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (e) {
        e.preventDefault()
        var href = this.getAttribute('href');
        var tgt = document.querySelector(href)
        if (tgt) {
            tgt.scrollIntoView({ behavior: 'smooth' })
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    showCart()
    console.log('ready');
});
