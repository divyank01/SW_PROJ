$("#signup-form").submit(function (e) {
    const elements = e.target.elements
    const payload = {type:'p'}
    Object.keys(elements).forEach(key => {
        if (elements[key].value)
            payload[elements[key].name] = elements[key].value
    })
    console.log(JSON.stringify(payload))
    $.post('/api/user/crte',payload).done(out=>{
        const res = JSON.stringify(out)
        window.location.href = '/home'
    })
    e.preventDefault();
})
$("#signup-ngo-form").submit(function (e) {
    const elements = e.target.elements
    const payload = {type:'n'}
    Object.keys(elements).forEach(key => {
        if (elements[key].value)
            payload[elements[key].name] = elements[key].value
    })
    console.log(JSON.stringify(payload))
    $.post('/api/user/crte',payload).done(out=>{
        const res = JSON.stringify(out)
        window.location.href = '/home'
    })
    e.preventDefault();
})