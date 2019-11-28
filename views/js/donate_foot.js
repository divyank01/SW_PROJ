$(document).ready(() => {
    const url = new URL(window.location.href)
    const userId = parseInt(url.searchParams.get('uId'))
    const txnId = parseInt(url.searchParams.get('txnId'))
    console.log(userId + "              " + txnId)
    $.post('/api/user/getDonation', {
        userId,
        txnId
    }).done((data) => {
        console.log(data);
        const out = JSON.parse(data)
        if (out.status === 'SUCCESS') {
            $('#firstName').val(out.userData.firstname)
            $('#lastName').val(out.userData.lastname)
            $('#email').val(out.userData.email)
            $('#don_amt').html(`$${out.txnData.amt}`)
            $('#txn_amt').html(`$${out.txnData.amt}`)
            $('#contrib').html(`$${out.txnData.amt*0.01}`)
            $('#ngo_name').html(out.ngoData.ngoname)
            $('#top_logo').attr('src',out.ngoData.logo)

            $('#myspinner').addClass('hide')
        }
    })
})

$('#checkout').submit((e) => {
    const elements = e.target.elements
    const payload = {
        type: 'n'
    }
    $('#myspinner').removeClass('hide')
    const url = new URL(window.location.href)
    const userId = parseInt(url.searchParams.get('uId'))
    const txnId = parseInt(url.searchParams.get('txnId'))
    Object.keys(elements).forEach(key => {
        if (elements[key].type === 'radio') {
            payload[elements[key].name] = elements[key].id
        } else {
            if (elements[key].value)
                payload[elements[key].name] = elements[key].value
        }
    })
    payload.userId = userId
    payload.txnId = txnId
    console.log(payload)
    $.post('/api/user/checkout', payload).done((data) => {
        console.log(data)
        $('#myspinner').addClass('hide')
        $('#suck').removeClass('hide')
        $('#chkout_frm').addClass('hide')
    })
    e.preventDefault();
})