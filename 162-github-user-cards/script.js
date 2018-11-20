function render(container, data) {
    container.innerHTML = tmpl('template', data)
    container.style.setProperty('--avatar', `url(${data.avatar_url})`)
}

function getData(username) {
    let apiUrl = `https://api.github.com/users/${username}`
    fetch(apiUrl)
        .then(response => response.json())
        .then(update)
}

function update(data) {
    let current = document.getElementsByClassName('profile')[0]
    let isInitial = (current.innerHTML == '')

    if (isInitial) {
        render(current, data)
        return
    }

    // create a new card
    let next = document.createElement('div')
    next.className = 'profile'
    next.style.left = '100%'
    render(next, data)
    current.after(next)

    // define animation properties
    let animationOut = {
        keyframes: [
            {left: '0', opacity: 1, offset: 0},
            {left: '-100%', opacity: 0, offset: 1}
        ],
        options: {
            duration: 500,
            fill: 'forwards'
        }
    }

    let animationIn = {
        keyframes: [
            {left: '100%', opacity: 0, offset: 0},
            {left: '0', opacity: 1, offset: 1}
        ],
        options: {
            duration: 500,
            fill: 'forwards',
            delay: 500
        }
    }

    // animate the out animation first,
    // then animate the in animation
    let anime = current.animate(animationOut.keyframes, animationOut.options)
    anime.onfinish = () => {
        current.remove()
        next.animate(animationIn.keyframes, animationIn.options)
    }
}

let mockData = {
    "avatar_url": "https://avatars3.githubusercontent.com/u/583231?v=4",
    "name": "The Octocat",
    "location": "San Francisco",
    "public_repos": 111,
    "followers": 222,
    "following": 333,
    "html_url": "https://github.com/octocat",
}

window.onload = update(mockData)

document.getElementById('search').addEventListener('click', () => {
    let username = document.getElementById('username').value.replace(/[ ]/g, '')
    if (username == '') return;
    getData(username)
})
