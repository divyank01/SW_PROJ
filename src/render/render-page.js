import path from 'path'
const render = (req, res) => {
    const _path = req.path
    console.log(_path)
    const isValid = (res) => {
        if (!(req.cookies['auth-user'] && JSON.parse(req.cookies['auth-user']).userId)) {
            res.redirect('/')
            //res.sendFile(path.resolve(__dirname, `../../`, 'views', 'home.html'))
            return false
        }
        return true
    }
    switch (_path) {
        case `/home`:
            res.sendFile(path.resolve(__dirname, `../../`, 'views', 'home.html'))
            break
        case `/signin`:
            res.sendFile(path.resolve(__dirname, `../../`, 'views', 'signin.html'))
            break
        case `/signup`:
            res.sendFile(path.resolve(__dirname, `../../`, 'views', 'signup.html'))
            break
        case `/donate`:
            if (isValid(res))
                res.sendFile(path.resolve(__dirname, `../../`, 'views', 'donation.html'))
            break
        case `/profile`:
            if (isValid(res))
                res.sendFile(path.resolve(__dirname, `../../`, 'views', 'profile.html'))
            break
        case `/search`:
            if (isValid(res))
                res.sendFile(path.resolve(__dirname, `../../`, 'views', 'profile.html'))
            break
        case `/add_ngo`:
            res.sendFile(path.resolve(__dirname, `../../`, 'views', 'ngo_reg.html'))
            break
        case `/ngo_profile`:
            if (isValid(res))
                res.sendFile(path.resolve(__dirname, `../../`, 'views', 'ngo_profile.html'))
            break
        default:
            res.sendFile(path.resolve(__dirname, `../../`, 'views', 'home.html'))
    }
}

export default render