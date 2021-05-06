import app from './firebase.js'
import db from './firebase.js'

const page1 = document.getElementById("page1")
const setPwPage = document.getElementById("page2-setPW")
const loginPage = document.getElementById("page2-pw")
const loading = document.getElementById("onLoading")
const page3 = document.getElementById("page3")

const dbp = db.db

const checkCode = document.getElementById("checkCode")
checkCode.addEventListener('click', codeChecker)

const setPW = document.getElementById("setPW")
setPW.addEventListener('click', pwSetter)

const login = document.getElementById("login")
login.addEventListener('click', signIn)

const gameCode = document.getElementById("gameCode")
const setGamePW = document.getElementById("setGamePW")
const gamePW = document.getElementById("gamePW")

const storage = window.sessionStorage

let code = ''

let topics = []

dbp.collection('GameTopic').get().then((items) => {
    items.forEach((doc) => {
        topics.push(doc.data().topic)
    })
})

function codeChecker() {
    if (gameCode.value === '') {
        window.alert("請輸入遊戲碼")
        return
    }

    code = gameCode.value

    //如果已經有題目存在session storage了，表示剛剛已經登入過，直接進入page3
    if (storage.getItem(code + 'TeamTopics')) {
        const teamTop = storage.getItem(code + 'TeamTopics').split(',')
        const topicItems = document.getElementsByClassName("topicItem")
        for (let i = 0; i < topicItems.length; i++) {
            topicItems[i].innerText = teamTop[i]
        }
        window.alert("登入成功！")
        page1.style.display = 'none'
        page3.style.display = 'block'

        return
    }

    if (storage.getItem(code)) {
        window.alert("登入成功!")
        page1.style.display = 'none'
        loginPage.style.display = 'block'
        return
    }

    const dR = dbp.collection('GameCode').doc(code)
    dR.get().then((doc) => {
        if (doc.exists) {
            const pw = doc.data().pw
            window.alert("登入成功！")
            page1.style.display = 'none'
            if (pw === '') {
                setPwPage.style.display = 'block'
            } else {
                storage.setItem(code, pw)
                loginPage.style.display = 'block'
            }
        } else {
            window.alert("登入失敗！請確認你的遊戲碼")
        }
        gameCode.value = ''
    }).catch((error) => {
        console.log('Error: ', error)
        window.alert("出現錯誤！請跟開發者聯繫！！")
        window.location.reload()
    })
}

//追加設定: 安全性規則的關係，將會在設定密碼階段就把題目組一起匯入gameCode中
function pwSetter() {
    if (!setGamePW) {
        window.alert("請輸入密碼")
        return
    }

    const pasw = setGamePW.value

    // db.collection('GameTopic').get().then((items) => {
    //     items.forEach((doc) => {
    //         console.log(doc.data().topic)
    //         topics.push(doc.data().topic)
    //         // if (!topics.includes(doc.data().topic)) {
    //         //     topics.push(doc.data().topic)
    //         // }
    //     })
    // }).catch((error) => {
    //     console.log(error)
    // })

    console.log(topics)

    let teamTopics = []
    while (teamTopics.length < 4) {
        r = Math.floor(Math.random() * topics.length)
        if (!teamTopics.includes(topics[r])) {
            teamTopics.push(topics[r])
        }
    }

    const dR = dbp.collection('GameCode').doc(code)
    dR.set({
        pw: pasw,
        topics: teamTopics,
    }, {
        merge: true
    }).then(() => {
        window.alert('設定成功！')
        setPwPage.style.display = 'none'

        //render page3
        const topicItems = document.getElementsByClassName("topicItem")
        for (let i = 0; i < topicItems.length; i++) {
            topicItems[i].innerText = teamTopics[i]
        }
        page3.style.display = 'block'

        storage.setItem(code + 'TeamTopics', teamTopics)
        storage.setItem(code, pasw)
    }).catch((error) => {
        window.alert(`出現錯誤: $(error)\n\n請跟開發者聯繫..`)
        window.location.reload()
    })
}

function signIn() {
    if (!gamePW) {
        window.alert("請輸入密碼")
        return
    }

    const inputPW = gamePW.value

    const paw = storage.getItem(code)

    if (inputPW === paw) {
        window.alert('登入成功！')

        loginPage.style.display = 'none'

        let teamTopics = []
        const dR = dbp.collection('GameCode').doc(code)
        dR.get().then((doc) => {
            if (doc.exists) {
                teamTopics = doc.data().topics
                storage.setItem(code + 'TeamTopics', teamTopics)
            } else {
                window.alert("資料有誤，請洽管理員")
                window.location.reload()
            }
        }).catch((error) => {
            window.alert(`出現錯誤: $(error)\n\n請跟開發者聯繫..`)
            window.location.reload()
        })
        
        
        //render page3    
        loading.style.display = 'block'
        window.setTimeout(() => {
            const topicItems = document.getElementsByClassName("topicItem")
            for (let i = 0; i < topicItems.length; i++) {
                topicItems[i].innerText = teamTopics[i]
            }
            loading.style.display = 'none'
            page3.style.display = 'block'
        }, 2000)

    } else {
        window.alert('登入失敗，請確認你的密碼!')
        gamePW.value = ''
    }
}
