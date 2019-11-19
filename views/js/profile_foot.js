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
            })
        } else {
            $('#user_name').html(`${res.ngoname}`)
            $('#ngo_buttons').removeClass("hide")
            $("#add_event_row").removeClass("hide")
        }
    })
})

const ids = ['event_row', 'show_fav_ngo_row', 'search_row', 'add_event_row']

const show = (key) => {
    ids.forEach(elem => {
        $(`#${elem}`).addClass('hide')
    })
    if (key)
        $(`#${key}`).removeClass('hide')
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
            debugger
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

$('#_fav').click(() => {
    show('show_fav_ngo_row')

    $.post('/api/user/getFavNgos',{}).done(data =>{
        $('#fav_ngo_list').empty()
        console.log(data)
        JSON.parse(data).ngos.forEach(elem => {
            $('#fav_ngo_list').append(`<li class="list-group-item list-group-item-dark">
                    ${elem.ngoname}
                    <button type="button" class="btn add-fav btn-primary list-group-item-primary srch-res-btn" data-ngoId="${elem.ngoId}">Donate</button>
                </li>`
            )
        })
    })
})