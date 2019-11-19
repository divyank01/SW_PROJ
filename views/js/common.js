$(document).ready(()=>{
    $('#logout-btn').click(()=>{
        $.post('/api/logout',{}).done((data)=>{
            if(data && data.status==='SUCCESS'){
                window.location.href = '/signin'
            }
        })
    })
})