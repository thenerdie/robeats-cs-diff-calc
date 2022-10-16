const constants = require("./constants")

const { detectPatterns } = require("./patterns/detect")

// const chordjack = require("./patterns/chordjack")

const maxMs = 500

const SCALE_FACTOR = 4.5

function collectCohesions(hitObjects) {
    let cohesions = []

    let thisCohesion = {
        Time: null,
        HitObjects: []
    }

    hitObjects.forEach(hitObject => {
        if (hitObject.Time === thisCohesion.Time) {
            thisCohesion.HitObjects[hitObject.Track - 1] = true
        } else {
            if (thisCohesion.Time) {
                thisCohesion.Type = constants.getCohesionType(thisCohesion)

                cohesions.push(thisCohesion)
            }

            let cohesionObjects = [ false, false, false, false ]

            cohesionObjects[hitObject.Track - 1] = true

            thisCohesion = {
                Time: hitObject.Time,
                HitObjects: cohesionObjects
            }
        }
    })

    return cohesions
}

function splitCohesionsIntoSeconds(cohesions) {
    let seconds = []
    let thisSecond = []

    let thisSecondStart = cohesions[0].Time
    let index = 0

    for (let cohesion of cohesions) {
        if (cohesion.Time - thisSecondStart <= 1000) {
            thisSecond.push(cohesion)
        } else {
            index++
            thisSecondStart = cohesion.Time
            seconds.push(thisSecond)
            thisSecond = [ cohesion ]
        }
    }

    return seconds
}

function calculateDifficulty(hitObjects, rate, name) {
    const line = "----"

    let debug = [ name ]

    hitObjects.forEach(hitObject => {
        hitObject.Time /= rate

        if (hitObject.Duration)
            hitObject.Duration /= rate
    });

    const cohesions = collectCohesions(hitObjects)
    const seconds = splitCohesionsIntoSeconds(cohesions)

    let sectionDfficulties = []

    for (let second of seconds.slice().reverse()) {
        let nps = constants.getNPS(second)

        const diff = nps / SCALE_FACTOR

        sectionDfficulties.push(diff)

        debug.push(`${line} NPS: ${nps}`)

        for (let cohesion of second.slice().reverse()) {
            debug.push(constants.renderCohesion(cohesion))
        }
    }

    const difficulty = constants.sortedAvg(sectionDfficulties)

    debug.push("\n")
    debug.push(difficulty)

    fs.writeFileSync(`./debug/${name}.txt`, debug.join("\n"))

    return difficulty
}

const fs = require("fs")
const { dir } = require("console")

fs.readdirSync("./tests").forEach(dir => {
    const map = require(`./tests/${dir}`)
    
    console.log(`${dir} ${calculateDifficulty(map.HitObjects, 1, dir).toFixed(2)}`)
})
