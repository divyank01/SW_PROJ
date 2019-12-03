$(document).ready(() => {
    const url = new URL(window.location.href)
    console.log(url.searchParams.get('ngo_id'))
    $.post('/api/user/findNgoById', {
        ngoId: url.searchParams.get('ngo_id')
    }).done(out => {
        const res = JSON.parse(out)
        console.log(res)
        if (res.ngo) {
            if(res.userInt && res.userInt.length>0 && res.userInt.indexOf(parseInt(url.searchParams.get('ngo_id')))>-1){
                $('#don_form').removeClass('hide')
                $('#mk_donate').click(() => {
                    const amt = parseFloat($('#don_amt').val())
                    const url = new URL(window.location.href)
                    console.log(url.searchParams.get('ngo_id'))
                    debugger
                    if (amt > 0) {
                        console.log(amt)
                        $.post('/api/user/donate', {
                            amt,
                            ngoId: parseInt(url.searchParams.get('ngo_id'))
                        }).done((out) => {
                            const data = JSON.parse(out)
                            console.log(data)
                            window.location.href = `/donate?uId=${data.txnData.userId}&txnId=${data.txnData.txnId}`
                        })
                    }
                })
            }
            $('#ngoname').html(`${res.ngo.ngoname}`)
            $('#description').html(res.ngo.description)
            $('#myspinner').addClass('hide')
        }
    })
})