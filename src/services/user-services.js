import {
    save,
    get,
    getAll,
    update
} from './dao'

const createUser = async (req, res) => {
    const {
        email,
        firstname,
        lastname,
        password,
        type,
        description,
        ngoname,
    } = req.body
    if (type === 'p') {
        const data = await save('User', {
            email,
            firstname,
            lastname,
            type
        })
        await save('Login', {
            email,
            password
        })
        res.cookie('auth-user', JSON.stringify({
            userId: data.userId,
            email
        }))
        res.write(JSON.stringify({
            status: "SUCCESS",
            ...data
        }))
    } else if (type === 'n') {
        const data = await save('User', {
            email,
            firstname,
            lastname,
            type
        })
        const ngoData = await save('NGO', {
            email,
            firstname,
            lastname,
            description,
            ngoname,
            userId: data.userId
        })
        await save('Login', {
            email,
            password
        })
        res.cookie('auth-user', JSON.stringify({
            userId: data.userId,
            email
        }))
        res.write(JSON.stringify({
            status: "SUCCESS",
            ...data,
            ...ngoData
        }))
    }

    res.end()
}

const getAuthUser = async (req, res) => {
    if (req.cookies['auth-user']) {
        console.log(req.cookies['auth-user'])
        console.log({
            userId: JSON.parse(req.cookies['auth-user']).userId
        })
        let ngoData = {}
        const data = await get('User', {
            userId: JSON.parse(req.cookies['auth-user']).userId
        })
        if (data.type === 'n') {
            ngoData = await get('NGO', {
                userId: JSON.parse(req.cookies['auth-user']).userId
            })
        }
        res.write(JSON.stringify({
            status: "SUCCESS",
            ...ngoData,
            ...data,
        }))
        res.end()
    } else {
        res.write(JSON.stringify({
            status: "FAILURE"
        }))
        res.end()
    }
}

const addEvent = async (req, res) => {
    const {
        description,
        subject,
    } = req.body
    if (req.cookies['auth-user']) {
        console.log(req.cookies['auth-user'])
        console.log({
            userId: JSON.parse(req.cookies['auth-user']).userId
        })
        let ngoData = {}
        let eventData = {}
        const data = await get('User', {
            userId: JSON.parse(req.cookies['auth-user']).userId
        })
        if (data.type === 'n') {
            ngoData = await get('NGO', {
                userId: JSON.parse(req.cookies['auth-user']).userId
            })
            eventData = await save('Events', {
                subject,
                description,
                ngoName: ngoData.ngoname,
                userId: data.userId
            })
        }
        res.write(JSON.stringify({
            status: "SUCCESS",
            ...ngoData,
            ...data,
            ...eventData
        }))
        res.end()
    } else {
        res.write(JSON.stringify({
            status: "FAILURE"
        }))
        res.end()
    }
}

const signin = async (req, res) => {
    const {
        email,
        password,
    } = req.body
    const data = await get('User', {
        email
    })
    if (data) {
        const loginData = await get('Login', {
            email
        })
        console.log(loginData)
        console.log(password)
        console.log(loginData.password === password)
        if (loginData && loginData.password === password) {
            res.cookie('auth-user', JSON.stringify({
                userId: data.userId,
                email
            }))
            res.write(JSON.stringify({
                status: "SUCCESS"
            }))
        } else {
            res.write(JSON.stringify({
                status: "FAILURE"
            }))
        }
    } else {
        res.write(JSON.stringify({
            status: "FAILURE"
        }))
    }
    res.end()
}

const logout = async (req, res) => {
    if (req.cookies['auth-user']) {
        console.log(req.cookies['auth-user'])
        res.clearCookie('auth-user')
        res.write(JSON.stringify({
            status: "SUCCESS"
        }))
    } else {
        res.write(JSON.stringify({
            status: "FAILURE"
        }))

    }
    res.end()
}

const findNgos = async (req, res) => {
    const {
        ngoname
    } = req.body
    console.log(ngoname)
    const out = await getAll('NGO', {
        ngoname: new RegExp(ngoname, 'i')
    })
    console.log(out)
    if (out) {
        res.write(JSON.stringify({
            status: "SUCCESS",
            ngos: out
        }))
    } else {
        res.write(JSON.stringify({
            status: "FAILURE"
        }))
    }
    res.end()
}

const addInterest = async (req, res) => {
    if (req.cookies['auth-user']) {
        console.log(req.cookies['auth-user'])
        const userId = JSON.parse(req.cookies['auth-user']).userId
        const {
            ngoId
        } = req.body
        console.log(ngoId)
        const out = await get('User', {
            userId
        })
        console.log(out)
        if (out && out.interestId) {
            const interest = await get('Interest', {
                interestId: out.interestId
            })
            if (interest) {
                if (interest.ngos.indexOf(ngoId) < 0) {
                    interest.ngos.push(ngoId)
                    await update('Interest', interest, out.interestId)
                }
            }
            res.write(JSON.stringify({
                status: "SUCCESS",
                interest
            }))
        } else if (out) {
            const interests = []
            interests.push(ngoId)
            const data = await save('Interest', {
                ngos: interests
            })
            await update('User', {
                interestId: data.interestId
            }, userId)
            res.write(JSON.stringify({
                status: "SUCCESS",
                interest: data
            }))
        } else {
            res.write(JSON.stringify({
                status: "FAILURE"
            }))
        }
    } else {
        res.write(JSON.stringify({
            status: "FAILURE"
        }))
    }
    res.end()
}

const getInterestedEvents = async (req, res) => {
    if (req.cookies['auth-user']) {
        console.log(req.cookies['auth-user'])
        const userId = JSON.parse(req.cookies['auth-user']).userId
        const out = await get('User', {
            userId
        })
        if (out && out.interestId) {
            const events = []
            const interests = await get('Interest', {
                interestId: out.interestId
            })
            if (interests && interests.ngos && interests.ngos.length > 0) {
                await Promise.all(interests.ngos.map(async ngoId => {
                    //debugger
                    const _ngo = await get('NGO', {
                        ngoId: parseInt(ngoId)
                    })
                    const _events = await getAll('Events', {
                        userId: _ngo.userId
                    })
                    if (_events) {
                        _events.forEach(_evnt => {
                            events.push(_evnt)
                        })
                    }
                }))
                res.write(JSON.stringify({
                    status: "SUCCESS",
                    events
                }))
            } else {
                res.write(JSON.stringify({
                    status: "SUCCESS",
                    events: []
                }))
            }
        } else {
            res.write(JSON.stringify({
                status: "SUCCESS",
                events: []
            }))
        }
    } else {
        res.write(JSON.stringify({
            status: "FAILURE",
            events: []
        }))
    }
    res.end()
}

const getFavNgos = async (req, res) => {
    if (req.cookies['auth-user']) {
        console.log(req.cookies['auth-user'])
        console.log({
            userId: JSON.parse(req.cookies['auth-user']).userId
        })
        const data = await get('User', {
            userId: JSON.parse(req.cookies['auth-user']).userId
        })
        const interest = await get('Interest', {
            interestId: data.interestId
        })
        console.log(interest)
        const _ngos = []
        interest.ngos.forEach(key => _ngos.push(parseInt(key)))
        const ngos = await getAll('NGO', {
            'ngoId': {
                '$in': _ngos
            }
        })
        console.log(ngos)
        res.write(JSON.stringify({
            status: "SUCCESS",
            ...data,
            ngos
        }))
        res.end()
    } else {
        res.write(JSON.stringify({
            status: "FAILURE"
        }))
        res.end()
    }
}

export default {
    createUser,
    getAuthUser,
    addEvent,
    signin,
    logout,
    findNgos,
    addInterest,
    getInterestedEvents,
    getFavNgos
}