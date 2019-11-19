import path from 'path'
const render = (req,res) => {
    const _path = req.path
    console.log(_path)
    switch(_path){
        case `/home`:
            res.sendFile(path.resolve(__dirname,`../../`,'views','home.html'))
            break
        case `/signin`:
            res.sendFile(path.resolve(__dirname,`../../`,'views','signin.html'))
            break
        case `/signup`:
            res.sendFile(path.resolve(__dirname,`../../`,'views','signup.html'))
            break
        case `/donate`:
            res.sendFile(path.resolve(__dirname,`../../`,'views','donation.html'))
            break
        case `/profile`:
            res.sendFile(path.resolve(__dirname,`../../`,'views','profile.html'))
            break
        case `/search`:
            res.sendFile(path.resolve(__dirname,`../../`,'views','profile.html'))
            break
        case `/add_ngo`:
            res.sendFile(path.resolve(__dirname,`../../`,'views','ngo_reg.html'))
            break
        default:
            res.sendFile(path.resolve(__dirname,`../../`,'views','home.html'))
    }
}

export default render