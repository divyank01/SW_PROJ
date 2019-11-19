$(document).ready(()=>{
    $.post('/api/user/getAuthUser',{}).done(out=>{
        const res = JSON.parse(out)
        if(res && res.status === `SUCCESS`){
            $('#prfllnk').removeClass('hide')
            $('#log_container').html('<a href="#" class="badge badge-light" id="logout-btn">Logout</a>')
        }else{
            $('#log_container').html('<a href="/signin" class="badge badge-light" id="login-btn">Login</a>')
        }
        
    })
})