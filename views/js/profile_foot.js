$(document).ready(() => {
    $.post('/api/user/getAuthUser', {}).done(out => {
        const res = JSON.parse(out)
        console.log(res)
        if (res.type === 'p') {
            $('#user_name').html(`${res.firstname} ${res.lastname}`)
            $('#user_button').removeClass("hide")
            $('#event_row').removeClass("hide")
            $.post('/api/user/getInterestedEvents', {}).done(out => {
                const res = JSON.parse(out)
                console.log(res)
                if (res && res.events && res.events.length > 0) {
                    res.events.map((key, idx) => {
                        $('#int-events').append(`
                <li class="list-group-item list-group-item-dark">
                <h3>${key.subject}</h3>    
                <h6>${key.ngoName}</h6>
                <p>${key.description}</p>
                </li>`)
                    })
                }
                $('#myspinner').addClass('hide')
            })
            $.post('/api/user/donationsForUser',{}).done(data => {
                let total=0
                console.log(data)
                console.log('total'+total)
                JSON.parse(data).txns.forEach(elem => {
                    total=total+parseFloat(elem.amt)
                })
                console.log('total'+total)
                const pers = (total/10000)*100
                console.log('total'+pers)
                $('#starz').css('width',pers+'%')
                $('#don_meter').removeClass('hide')
            })
        } else {
            $('#user_name').html(`${res.ngoname}`)
            $('#ngo_buttons').removeClass("hide")
            $("#add_event_row").removeClass("hide")
            $('#myspinner').addClass('hide')
        }
    })
})

const ids = ['event_row', 'show_fav_ngo_row', 'search_row', 'add_event_row', 'myspinner','incoming_don']

const show = (key) => {
    ids.forEach(elem => {
        $(`#${elem}`).addClass('hide')
    })
    if (key)
        $(`#${key}`).removeClass('hide')
}
const hide = (key) => {
    $(`#${key}`).addClass('hide')
}

$('#add_event_btn').click(() => {
    const subject = $('#subject').val()
    const description = $('#description').val()
    debugger
    $.post('/api/user/addEvent', {
        subject,
        description
    }).done(out => {
        const res = JSON.parse(out)
        console.log(res)
    })
})

$('#show_search').click(() => {
    show('search_row')
})

$('#search_ngo_btn').click(() => {
    const ngoname = $('#ngoname').val()
    $('#seach_results').empty()
    $.post('/api/user/findNgo', {
        ngoname
    }).done(out => {
        const res = JSON.parse(out)
        console.log(res)
        if (res && res.ngos && res.ngos.length > 0) {
            res.ngos.map((key, idx) => {
                $('#seach_results').append(`
                <li class="list-group-item list-group-item-dark">
                    ${key.ngoname}
                    <button type="button" class="btn add-fav btn-primary list-group-item-primary srch-res-btn" data-ngoId="${key.ngoId}">Add</button>
                </li>`)
            })
        }
        $(".srch-res-btn").click((e) => {
            const ngoId = e.target.dataset.ngoid
            $.post('/api/user/addInterest', {
                ngoId
            }).done(() => {
                console.log('added ' + ngoId)
            })
            e.preventDefault()
            event.stopPropagation();
            event.stopImmediatePropagation();
        })
    })
})

const getNewRow = (arr) => {
    const mapOut = arr.map((key) => `<div class="text-center col-md-${12/arr.length} fav_ngo_a" data-ngo="${key.ngoId}">
                    <img src="${key.logo}" class="img-thumbnail" height="200" width="200" data-ngo="${key.ngoId}"/><h4 class="text-center" data-ngo="${key.ngoId}">${key.ngoname}</h4>
                </div>`)
    const outReduce = mapOut.reduce((old, key) => old + key)
    return `<div class="row">
                ${outReduce}
            </div>`
}

$('#_fav').click(() => {
    show('myspinner')
    $.post('/api/user/getFavNgos', {}).done(data => {
        $('#fav_ngo_list').empty()
        console.log(data)
        let temp = []
        JSON.parse(data).ngos.forEach((elem, idx) => {
            if ((idx + 1) % 3 == 0) {
                temp.push(elem)
                if(temp.length>0)
                $('#fav_ngo_list').append(getNewRow(temp))
                temp = []
            } else {
                temp.push(elem)
            }
        })
        if(temp.length>0)
        $('#fav_ngo_list').append(getNewRow(temp))
        show('show_fav_ngo_row')
        $(".fav_ngo_a").click((e) => {
            const ngoId = e.target.dataset.ngo
            window.location.href = '/ngo_profile?ngo_id='+ngoId
            e.preventDefault()
            event.stopPropagation();
            event.stopImmediatePropagation();
        })
    })
})

$('#accept_donation_btn').click(()=>{
    show('myspinner')
    $.post('/api/user/getPendingDonations',{}).done((data)=>{
        console.log(data)
        show('incoming_don')
        $('#in_don_body').empty()
        const _data = JSON.parse(data)
        _data.txnData.forEach((item,idx)=>{
            $('#in_don_body').append(`
            <tr id="txn_id_${item.tnxId}">
                <th scope="row">${idx+1}</th>
                <td>${item.firstname} ${item.lastname}</td>
                <td>${item.email}</td>
                <td>$${item.amt}</td>
                <td><button class="btn btn-primary accept_donation_btn" data-txn="${item.txnId}" type="button">Accept</button></td>
            </tr>
            `)
        })
        $(".accept_donation_btn").click((e) => {
            const txnId = e.target.dataset.txn
            console.log(txnId)
            $.post('/api/user/acceptDonation', {
                txnId
            }).done(() => {
                $('#incoming_don').remove(`#txn_id_${txnId}`)
            })
            e.preventDefault()
            event.stopPropagation();
            event.stopImmediatePropagation();
        })
    })
})