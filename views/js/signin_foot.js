
$("#signin-form").submit(function( e ) {
    debugger
    var elements = e.target.elements
    console.log(Object.keys(elements))
    const payload = {}
    Object.keys(elements).forEach(key => {
        if (elements[key].value)
            payload[elements[key].name] = elements[key].value
    })
    console.log(JSON.stringify(payload))
    $.post('/api/signin',payload).done(out=>{
        const res = JSON.parse(out)
        if(res.status === 'SUCCESS'){
            window.location.href = '/home'
        }
    })
    e.preventDefault();
});