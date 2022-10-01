const constants = require("./constants")

const chordjack = require("./patterns/chordjack")

const maxMs = 500

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

function calculateDifficulty(hitObjects) {
    // let streamStrains = []

    const cohesions = collectCohesions(hitObjects)

    return chordjack.calculateChordjackDifficulty(cohesions)

    // let strains = []

    // cohesions.forEach((cohesion, i) => {
    //     if (i != 0) {
    //         const lastCohesion = cohesions[i - 1]

    //         const difference = cohesion.Time - lastCohesion.Time

    //         let buffs = []

    //         for (let track of [0, 1, 2, 3]) {
    //             if (lastCohesion.HitObjects[track] && cohesion.HitObjects[track]) {
    //                 if (difference > 500) {
    //                     anchorCount[track] = 0
    //                 }

    //                 if (anchorCount[track] < letMaxAnchor)
    //                     anchorCount[track]++
                    
    //                     const thisBuff = anchorBuff * (anchorCount[track] / letMaxAnchor)

    //                     buffs.push(thisBuff)
    //             }
    //         }

    //         const baseDifficulty = strainToDifficulty(difference)

    //         let avgBuff = 0

    //         buffs.forEach(buff => {
    //             avgBuff += buff
    //         })

    //         avgBuff /= buffs.length

    //         strains.push(baseDifficulty)
    //     }
    // })

    // let diff = 0

    // strains.forEach(d => {
    //     // console.log(d)

    //     diff += d
    // })

    // return diff / strains.length

    // return diff
}

const fs = require("fs")

fs.readdirSync("./tests").forEach(dir => {
    const map = require(`./tests/${dir}`)
    
    console.log(`${dir} ${calculateDifficulty(map.HitObjects).toFixed(2)}`)
})
