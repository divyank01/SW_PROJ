import express from 'express'
import cookieParser from 'cookie-parser'
import {
    createUser,
    getAuthUser,
    addEvent,
    signin,
    logout,
    findNgos,
    addInterest,
    getInterestedEvents,
    getFavNgos,
    findNgoById,
    makeDonation,
    getDonation,
    checkout,getPendingDonations,acceptDonation
} from '../services/user-services'
import render from '../render/render-page'
import path from 'path'

const router = express.Router()

export default (app) => {
    const setupServices = () => {
        router.post('/api/user/crte', createUser)
        router.post('/api/user/getAuthUser', getAuthUser)
        router.post('/api/user/addInterest', addInterest)
        router.post('/api/user/getInterestedEvents', getInterestedEvents)
        router.post('/api/user/addNgo', createUser)
        router.post('/api/user/addEvent', addEvent)
        router.post('/api/user/getFavNgos', getFavNgos)
        router.post('/api/user/findNgo', findNgos)
        router.post('/api/user/findNgoById', findNgoById)
        router.post('/api/logout', logout)
        router.post('/api/signin', signin)
        router.post('/api/user/donate', makeDonation)
        router.post('/api/user/getDonation', getDonation)
        router.post('/api/user/checkout', checkout)
        router.post('/api/user/getPendingDonations',getPendingDonations)
        router.post('/api/user/acceptDonation',acceptDonation)
    }
    const setupRender = () => {
        router.get('/*', render)
    }
    const setupStatic = () => {
        app.use('/styles', express.static(path.join(__dirname, '../../', 'styles')))
        app.use('/js', express.static(path.join(__dirname, '../../', 'views', 'js')))
        app.use('/imgs', express.static(path.join(__dirname, '../../', 'img')));
    }
    app.use(express.json())
    app.use(cookieParser())
    app.use(express.urlencoded())
    setupStatic()
    setupRender()
    setupServices()
    app.use(router)
}